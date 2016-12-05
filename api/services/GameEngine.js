/**
 * @namespace GameEngine
 */
module.exports = {

    /**
     * keys = Socket IDs
     * values = Socket objects
     */
    users: {},

    /**
     * Used to store data on each tick.
     * Allows sending data only when there is a diff between last data and current data.
     * This is important to avoid redrawing the canvas if there is nothing to draw.
     */
    lastData: {},

    /**
     * Executed in the GameController.socketRegister route action.
     */
    addUserFromSocketRequest: function (req) {

        let level = require('../game_levels/level_1');

        let user = {
            id:               req.socket.id,
            rendered:         false,
            soundsToPlay:     [],
            pick:             new Models.Pick(
                Math.round(level.mapWidth / 2),
                Math.round(level.mapHeight / 2) - 50,
                5, // Radius
                90, // Start angle in degrees
                1, // Speed
                4, // Rotation speed in degrees
                null
            ),
            movements:        {
                left:  false,
                right: false,
                up:    false,
                down:  false,
            },
            collidingObjects: {},
            level: level,
        };

        this.users[req.socket.id] = user;

        sails.sockets.join(req, 'game');

        SocketLooper.revalidateStatus();
        this.refreshClients();

        return user;
    },

    /**
     * Executed in config/sockets.js on each disconnection.
     * Can also be executed manually in GameController.socketDisconnect route action.
     */
    removeUserBySocketId: function (id) {
        if (!this.users[id]) {
            // User does not exist, so it must be an old socket that is not in memory anymore.
            return;
        }

        sails.sockets.leave(id, 'game');

        delete this.users[id];

        SocketLooper.revalidateStatus();
    },

    refreshClients: function () {

        for (let id in this.users) {
            if (!this.users.hasOwnProperty(id)) {
                continue;
            }
            let user = this.users[id];

            this.applyMovement(user);

            let data = Serializer.serializeDataFromUser(user);

            if (
                !user.rendered
                || !this.lastData[id]
                || (
                    this.lastData[id]
                    && !RedrawDiffChecker.simpleEqual(data, this.lastData[id])
                )
            ) {

                // Test collisions ONLY if we moved
                for (let i = 0, l = user.level.notes.length; i < l; i++) {
                    let note            = user.level.notes[i];
                    let collides        = CollisionsManager.testPickAndNoteCollide(user.pick, note);
                    let alreadyCollides = user.collidingObjects[note.uuid];

                    if (collides && !alreadyCollides) {
                        data.snd.push(note.soundEvent);
                        user.collidingObjects[note.uuid] = note;
                    } else if (!collides && alreadyCollides) {
                        delete user.collidingObjects[note.uuid];
                    }
                }

                sails.sockets.broadcast(id, 'game', data);

                if (user.soundsToPlay.length) {
                    user.soundsToPlay = [];
                }
            }

            this.lastData[id] = data;
        }
    },

    changeMovement: function (id, movementString, value) {
        if (!this.users[id] || !this.users[id].movements.hasOwnProperty(movementString)) {
            // User does not exist, so it must be an old socket that is not in memory anymore.
            // Or the different movements are not allowed yet
            return;
        }

        this.users[id].movements[movementString] = !!value;
        this.users[id].pick.moveRatio = this.users[id].movements.up ? 1 : -1;
    },

    applyMovement: function (user) {
        let moves = user.movements;

        if (!user.pick) {
            sails.log.error('Invalid user to apply movement to.');
            return;
        }

        // Handle angle & rotation direction system

        // Change angle if "left" or "right" is pushed
        if (moves.left || moves.right) {
            // let PI2 = 2 * PI;
            let angle = user.pick.angle;

            if (moves.left) {
                angle += user.pick.angleSpeed;
            } else if (moves.right) {
                angle -= user.pick.angleSpeed;
            }

            // Use this to avoid having huge integers to manage
            if (angle <= 0 || angle >= 360) {
                angle %= 360;
            }

            user.pick.angle = parseInt(angle);
        }

        // Up and down allow us to move either forwards or backwards.
        if (moves.up || moves.down) {

            let moveRatio = moves.up ? 1 : -1;

            let angleRadians = user.pick.angle * (Math.PI / 180);

            let x = user.pick.x + (moveRatio * user.pick.speed * Math.sin(angleRadians));
            let y = user.pick.y + (moveRatio * user.pick.speed * Math.cos(angleRadians));

            // Avoids collisions with canvas walls
            if (x >= 0 && x <= user.level.mapWidth) {
                user.pick.x = Math.round(x * 100) / 100;
            }
            if (y >= 0 && y <= user.level.mapHeight) {
                user.pick.y = Math.round(y * 100) / 100;
            }
        }

    }
};

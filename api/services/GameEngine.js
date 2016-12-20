
const Serializer = require('../../common_scripts/Serializer');

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

        let level = new LevelModel(1);

        let user = new GameUserModel(req, level);

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

            let data = Serializer.serializeUser(user);

            if (
                !user.rendered
                || !this.lastData[id]
                || (
                    this.lastData[id]
                    && !RedrawDiffChecker.simpleEqual(data, this.lastData[id])
                )
            ) {

                // Test collisions ONLY if we moved
                for (let i = 0, l = user.level.data.notes.length; i < l; i++) {
                    let gameNote        = user.level.data.notes[i];
                    let collides        = CollisionsManager.testPickAndNoteCollide(user.pick, gameNote);
                    let alreadyCollides = user.collidingObjects[gameNote.uuid];

                    if (collides && !alreadyCollides) {
                        data.snd.push(gameNote);
                        user.collidingObjects[gameNote.uuid] = gameNote;
                    } else if (!collides && alreadyCollides) {
                        delete user.collidingObjects[gameNote.uuid];
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

    /**
     * Change pick angle based on mouse coordinates.
     * Then, on next tick, pick will move accordingly to the calculated angle.
     *
     * @param {string} id
     * @param {number} x
     * @param {number} y
     * @param {boolean} isMoving
     */
    changeMovement: function (id, x, y, isMoving) {
        if (!this.users[id]) {
            // User does not exist, so it must be an old socket that is not in memory anymore.
            // Or the different movements are not allowed yet
            return;
        }

        let pick = this.users[id].pick;

        pick.isMoving = isMoving;

        let dX = x - pick.x;
        let dY = y - pick.y;

        pick.angle = Math.atan2(dX, dY); // In radians
    },

    applyMovement: function (user) {
        if (!user.pick) {
            sails.log.error('Invalid user to apply movement to.');
            return;
        }

        /** @type {PickModel} pick */
        let pick = user.pick;

        // Manage acceleration
        if (pick.isMoving) {
            pick.speed += pick.acceleration;
            if (pick.speed > pick.maxSpeed) {
                pick.speed = pick.maxSpeed;
            }
        } else {
            pick.speed -= (pick.acceleration / 2);
            if (pick.speed < 0) {
                pick.speed = 0;
            }
        }

        if (!pick.speed) {
            // If user is not moving, then... Don't make him move.
            return;
        }

        // Handle angle & rotation direction system

        let angle = pick.angle; // In radians

        let x = pick.x + (pick.speed * Math.sin(angle));
        let y = pick.y + (pick.speed * Math.cos(angle));

        // Avoids collisions with canvas walls
        if (x >= 0 && x <= user.level.data.mapWidth) {
            pick.x = Math.round(x * 100) / 100;
        }
        if (y >= 0 && y <= user.level.data.mapHeight) {
            pick.y = Math.round(y * 100) / 100;
        }
    }
};

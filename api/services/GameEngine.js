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
        let mapWidth  = 500;
        let mapHeight = 500;

        let user = {
            id:               req.socket.id,
            rendered:         false,
            soundsToPlay:     [],
            pick:             new Models.Pick(
                25,// Math.round(mapWidth / 2),
                Math.round(mapHeight / 2),
                2,
                90, // In degree
                1,
                4, // In degree
                '/images/guitar-pick.gif'
            ),
            map:              {
                width:  mapWidth,
                height: mapHeight,
            },
            assets:           {
                sounds: {
                    '0Sol#':  '/sounds/68447__pinkyfinger__piano-g.wav',
                    '1La':  '/sounds/68437__pinkyfinger__piano-a.wav',
                    '1Sib': '/sounds/68439__pinkyfinger__piano-bb.wav',
                    '1Si':  '/sounds/68438__pinkyfinger__piano-b.wav',
                    '1Do':  '/sounds/68441__pinkyfinger__piano-c.wav',
                    '1Re#':  '/sounds/68440__pinkyfinger__piano-c.wav',
                    '1Re':  '/sounds/68442__pinkyfinger__piano-d.wav',
                    '1Mib': '/sounds/68444__pinkyfinger__piano-eb.wav',
                    '1Mi':  '/sounds/68443__pinkyfinger__piano-e.wav',
                    '1Fab':  '/sounds/68446__pinkyfinger__piano-f.wav',
                    '1Fa':  '/sounds/68445__pinkyfinger__piano-f.wav',
                    '1Sol':  '/sounds/68448__pinkyfinger__piano-g.wav',
                },
            },
            movements:        {
                left:  false,
                right: false,
                up:    false,
                down:  false,
            },
            level:            {
                notes: []
            },
            collidingObjects: {},
        };

        // Add notes
        let coords = 100;
        user.level.notes.push(new Models.Note( 50+50, Math.round(mapHeight / 2), 'images/quaver.gif', 10, 20, new Models.SoundEvent('1Do', 0)));
        user.level.notes.push(new Models.Note( 75+50, Math.round(mapHeight / 2), 'images/quaver.gif', 10, 20, new Models.SoundEvent('1Do', 0)));
        user.level.notes.push(new Models.Note(100+50, Math.round(mapHeight / 2), 'images/quaver.gif', 10, 20, new Models.SoundEvent('1Do', 0)));
        user.level.notes.push(new Models.Note(125+50, Math.round(mapHeight / 2), 'images/quaver.gif', 10, 20, new Models.SoundEvent('1Re', 0)));
        user.level.notes.push(new Models.Note(150+50, Math.round(mapHeight / 2), 'images/quaver.gif', 10, 20, new Models.SoundEvent('1Mi', 0)));
        user.level.notes.push(new Models.Note(200+50, Math.round(mapHeight / 2), 'images/quaver.gif', 10, 20, new Models.SoundEvent('1Re', 0)));
        user.level.notes.push(new Models.Note(250+50, Math.round(mapHeight / 2), 'images/quaver.gif', 10, 20, new Models.SoundEvent('1Do', 0)));
        user.level.notes.push(new Models.Note(275+50, Math.round(mapHeight / 2), 'images/quaver.gif', 10, 20, new Models.SoundEvent('1Mi', 0)));
        user.level.notes.push(new Models.Note(300+50, Math.round(mapHeight / 2), 'images/quaver.gif', 10, 20, new Models.SoundEvent('1Re', 0)));
        user.level.notes.push(new Models.Note(325+50, Math.round(mapHeight / 2), 'images/quaver.gif', 10, 20, new Models.SoundEvent('1Re', 0)));
        user.level.notes.push(new Models.Note(350+50, Math.round(mapHeight / 2), 'images/quaver.gif', 10, 20, new Models.SoundEvent('1Do', 0)));

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
                for (var i = 0, l = user.level.notes.length; i < l; i++) {
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

                // console.info(JSON.stringify(user));
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

            let x = user.pick.x + moveRatio * user.pick.speed * Math.sin(angleRadians);
            let y = user.pick.y + moveRatio * user.pick.speed * Math.cos(angleRadians);

            // Avoids collisions with canvas walls
            if (x > 0 && x < user.map.width) {
                user.pick.x = Math.round(x);
            }
            if (y > 0 && y < user.map.height) {
                user.pick.y = Math.round(y);
            }
        }

    }
};

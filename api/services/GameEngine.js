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

        sails.sockets.join(req, 'game');

        this.users[req.socket.id] = {
            id:         null,
            playSounds: [],
            pick:       {
                x:          Math.round(mapWidth / 2),
                y:          Math.round(mapHeight / 2),
                radius:     2,
                angle:      180, // In degree
                speed:      Math.round(mapWidth / (25 * SocketLooper.tickInterval)), // Speed must be proportional to the canvas size
                angleSpeed: 4, // In degree
                imageUrl:   '/images/guitar-pick.gif',
            },
            map:        {
                width:  mapWidth,
                height: mapHeight,
            },
            assets:     {
                sounds: {
                    '0a':  '/sounds/68437__pinkyfinger__piano-a.wav',
                    '0b':  '/sounds/68438__pinkyfinger__piano-b.wav',
                    '0bb': '/sounds/68439__pinkyfinger__piano-bb.wav',
                    '0c':  '/sounds/68440__pinkyfinger__piano-c.wav',
                    '0d':  '/sounds/68442__pinkyfinger__piano-d.wav',
                    '0e':  '/sounds/68443__pinkyfinger__piano-e.wav',
                    '0eb': '/sounds/68444__pinkyfinger__piano-eb.wav',
                    '0f':  '/sounds/68445__pinkyfinger__piano-f.wav',
                    '0g':  '/sounds/68447__pinkyfinger__piano-g.wav',
                    '1c':  '/sounds/68441__pinkyfinger__piano-c.wav',
                    '1f':  '/sounds/68446__pinkyfinger__piano-f.wav',
                    '1g':  '/sounds/68448__pinkyfinger__piano-g.wav',
                },
            },
            movements:  {
                left:  false,
                right: false,
                up:    false,
                down:  false,
            },
            level:      {
                notes: [
                    {
                        x:        Math.round(mapWidth / 3),
                        y:        Math.round(mapWidth / 3),
                        imageUrl: 'images/quaver.gif'
                    }
                ]
            },
            // socket:    req.socket,
        };

        SocketLooper.revalidateStatus();
        this.refresh();

        return this.users[req.socket.id];
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

    refresh: function () {

        for (let id in this.users) {
            if (!this.users.hasOwnProperty(id)) {
                continue;
            }
            let user = this.users[id];

            this.applyMovement(user);

            let data = Serializer.serializeDataFromUser(user);

            // TODO: Add data.snd.push() for each collision with a note.

            if (
                !user.id
                || !this.lastData[id]
                || (
                    this.lastData[id]
                    && !RedrawDiffChecker.simpleEqual(data, this.lastData[id])
                )
            ) {
                console.info(JSON.stringify(user));
                sails.sockets.broadcast(id, 'game', data);
                if (!user.id) {
                    user.id = id;
                }
                if (user.playSounds.length) {
                    user.playSounds = [];
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

        /*
         // Handle classic directional direction system
         let speed = user.speed;

         if (moves.left && user.pick.x - 1 >= 0) {
         user.pick.x -= speed;
         }
         if (moves.right && user.pick.x + 1 <= user.map.width) {
         user.pick.x += speed;
         }
         if (moves.up && user.pick.y - 1 >= 0) {
         user.pick.y -= speed;
         }
         if (moves.down && user.pick.y + 1 <= user.map.height) {
         user.pick.y += speed;
         }
         */

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

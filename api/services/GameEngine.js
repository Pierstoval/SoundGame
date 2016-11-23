
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
        let width = req.param('width');
        let height = req.param('height');

        sails.sockets.join(req, 'game');

        this.users[req.socket.id] = {
            id:        null,
            pick:      {
                x:          0,
                y:          0,
                r:          2,
                angle:      180, // In degree
                speed:      4,
                angleSpeed: 4, // In degree too
            },
            map:       {
                width:  req.param('width') || 100,
                height: req.param('height') || 100,
            },
            movements: {
                left:  false,
                right: false,
                up:    false,
                down:  false,
            },
            socket:    req.socket,
        };

        SocketLooper.revalidateStatus();
        this.refresh();
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

            let data = Serializer.serializeUser(user);

            let propertiesToCheck = ['x', 'y', 'r', 'a'];

            if (
                !this.lastData[id]
                || (
                    this.lastData[id]
                    && RedrawDiffChecker.testDiff(data, this.lastData[id], propertiesToCheck)
                )
            ) {
                console.info(JSON.stringify(user.pick));
                sails.sockets.broadcast(id, 'game', data);
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

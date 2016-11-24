
const keyMovements = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

module.exports = {
    socketRegister: function (req, res) {
        if (!req.isSocket) {
            return res.badRequest();
        }

        let user = GameEngine.addUserFromSocketRequest(req);

        return res.ok(user);
    },

    socketDisconnect: function (req, res) {
        if (!req.isSocket) {
            return res.badRequest();
        }

        GameEngine.removeUserBySocketId(req.socket.id);

        return res.ok();
    },

    socketKeyDown: function (req, res) {
        if (!req.isSocket) {
            return res.badRequest();
        }

        let socketId = req.socket.id;

        if (!GameEngine.users[socketId]) {
            sails.log.warn('Invalid socket id for keyUp action');
            return;
        }

        let keyCode = req.param('key_code');
        let keyMovementString = keyMovements[keyCode];

        // Apply movement to key down
        if (keyMovementString) {
            GameEngine.changeMovement(socketId, keyMovementString, true);
        }

        return res.ok();
    },

    socketKeyUp: function (req, res) {
        if (!req.isSocket) {
            return res.badRequest();
        }

        let socketId = req.socket.id;

        if (!GameEngine.users[socketId]) {
            sails.log.warn('Invalid socket id for keyUp action');
            return;
        }

        // Stop movement on key up
        let keyCode = req.param('key_code');
        let keyMovementString = keyMovements[keyCode];

        // Apply movement to key down
        if (keyMovementString) {
            GameEngine.changeMovement(socketId, keyMovementString, false);
        }

        return res.ok();
    },

    start: function (req, res) {
        return res.view('front/game/start');
    }
};

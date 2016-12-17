
let Serializer = require('../../common_scripts/Serializer');
let keyMovements = require('../../common_scripts/allowedKeyCodes');

module.exports = {
    socketRegister: function (req, res) {
        if (!req.isSocket) {
            return res.badRequest();
        }

        let user = GameEngine.addUserFromSocketRequest(req);

        return res.ok(Serializer.serializeOnRegistration(user));
    },

    socketSetRendered: function (req, res) {
        if (!req.isSocket) {
            return res.badRequest();
        }

        let socketId = req.socket.id;

        if (!GameEngine.users[socketId]) {
            let msg = 'Invalid socket id for setRendered action';
            sails.log.warn(msg);
            return res.status(500).send(msg);
        }

        GameEngine.users[socketId].rendered = true;

        return res.ok();
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
            let msg = 'Invalid socket id for keyDown action';
            sails.log.warn(msg);
            return res.status(500).send(msg);
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
            let msg = 'Invalid socket id for keyUp action';
            sails.log.warn(msg);
            return res.status(500).send(msg);
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
    },

    game: function (req, res) {
        return res.view('front/game/game');
    },
};

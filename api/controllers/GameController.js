
let Serializer = require('../../common_scripts/Serializer');

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

    socketEvent: function (req, res) {
        if (!req.isSocket) {
            return res.badRequest();
        }

        let socketId = req.socket.id;

        if (!GameEngine.users[socketId]) {
            let msg = 'Invalid socket id for keyUp action';
            sails.log.warn(msg);
            return res.status(500).send(msg);
        }

        let type = req.param('type');
        let x = req.param('x');
        let y = req.param('y');

        // TODO: Check UI before calculating movement when we have one
        switch (type) {
            case 'up':
                // mouse/touch "up" => stop movement
                GameEngine.changeMovement(socketId, x, y, false);
                break;
            case 'down':
            case 'move':
                // mouse/touch "down" and "move" => start movement
                GameEngine.changeMovement(socketId, x, y, true);
                break;
            default:
                console.warn('Unknown event type "'+type+'".');
                break;
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

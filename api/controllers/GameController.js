
const keysAssociations = {
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

        GameUsers.addUserFromSocketRequest(req);

        return res.ok();
    },

    socketDisconnect: function (req, res) {
        if (!req.isSocket) {
            return res.badRequest();
        }

        GameUsers.removeUserBySocketId(req.socket.id);

        return res.ok();
    },

    socketKeyUp: function (req, res) {
        if (!req.isSocket) {
            return res.badRequest();
        }

        console.info('Key up', req.allParams());

        return res.ok();
    },

    socketKeyDown: function (req, res) {
        if (!req.isSocket) {
            return res.badRequest();
        }

        console.info('Key down', req.allParams());

        return res.ok();
    },

    start: function (req, res) {
        return res.view('front/game/start');
    }
};

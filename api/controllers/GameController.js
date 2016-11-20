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

    start: function (req, res) {
        return res.view('front/game/start');
    }
};

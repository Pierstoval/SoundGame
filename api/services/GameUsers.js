module.exports = {

    /**
     * keys = Socket IDs
     * values = Socket objects
     */
    users: {},

    /**
     * Executed in the GameController.socketRegister route action.
     */
    addUserFromSocketRequest: function (req) {
        sails.sockets.join(req, 'game');

        this.users[req.socket.id] = req.socket;

        SocketLooper.revalidateStatus();
    },

    /**
     * Executed in config/sockets.js on each disconnection.
     * Can also be executed manually in GameController.socketDisconnect route action.
     */
    removeUserBySocketId: function (id) {
        sails.sockets.leave(this.users[id], 'game');

        delete this.users[id];

        SocketLooper.revalidateStatus();
    },

    refresh: function () {
        for (let id in this.users) {
            if (!this.users.hasOwnProperty(id)) {
                continue;
            }

            console.info('Refreshing id' + id);

            sails.sockets.broadcast(id, 'game', {
                x: parseInt(Math.random() * 50, 10),
                y: parseInt(Math.random() * 50, 10),
                r: parseInt(Math.random() * 50, 10),
            });
        }
    },
};

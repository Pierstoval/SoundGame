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
        var _this = this;

        sails.sockets.join(req, 'game');

        User.create({
            socket_id: req.socket.id
        }).exec(function (err, user){
            if (err) {
                sails.log.error('Could not save user :(', err);

                return;
            }

            console.info('Added user', user);

            _this.users[req.socket.id] = user;

            SocketLooper.revalidateStatus();
        });
    },

    /**
     * Executed in config/sockets.js on each disconnection.
     * Can also be executed manually in GameController.socketDisconnect route action.
     */
    removeUserBySocketId: function (id) {
        var _this = this;

        sails.sockets.leave(this.users[id], 'game');

        User.destroy(this.users[id]).exec(function(err, user){
            if (err) {
                sails.log.error('Could not destroy user :(', err);

                return;
            }

            console.info('Destroying user', user);

            delete _this.users[id];

            SocketLooper.revalidateStatus();
        });
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

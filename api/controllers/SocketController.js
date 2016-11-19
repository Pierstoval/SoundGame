/**
 * SocketController
 *
 * @description :: Server-side logic for managing Sockets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    registerHome: function(req, res) {
        sails.sockets.join(req, 'home');

        return res.ok();
    }
};


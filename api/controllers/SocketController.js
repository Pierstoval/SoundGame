/**
 * SocketController
 *
 * @description :: Server-side logic for managing Sockets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    // Used for testing, at first
    registerHome: function(req, res) {
        if (!req.isSocket) {
            return res.badRequest();
        }

        sails.sockets.join(req, 'home');

        return res.ok();
    }

};


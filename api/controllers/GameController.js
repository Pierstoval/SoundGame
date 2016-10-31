module.exports = {

    create: function(req, res) {
        var name;

        if (!req.isSocket || req.method !== 'POST') {
            return res.badRequest();
        }

        name = req.param('name');

        if (!name.toLowerCase().trim().match(/^[a-z0-9_-]+$/gi)) {
            res.status(400);
            res.view('400', {message: 'Name not valid. Must match contain only alphanumerical characters.'});

            return res.send();
        }

        User.findOrCreateNewUser(name, function(err, user){

            console.info('findByName', err, user);

            if (user && user.name) {
                console.info('Found !');
                res.ok({
                    user: user
                });
            } else {
                console.info('not found...');
            }
        });
    },

    start: function (req, res) {
        // Make sure this is a socket request (not traditional HTTP)
        if (!req.isSocket) {
            return res.badRequest();
        }

        // Broadcast a "hello" message to all the fun sockets.
        // This message will be sent to all sockets in the "game" room,
        // but will be ignored by any client sockets that are not listening-- i.e. that didn't call `io.socket.on('hello', ...)`
        // The data of the message ({} object) is the "data" in io.socket.on('hello', function gotHelloMessage (data)

        console.info('socket:', req.socket);

        sails.sockets.broadcast('game', 'hello', {id: 'my id: '}, req);

        console.info(sails.sockets);
        console.info('id'+sails.sockets.id);

        // Respond to the request with an a-ok message
        // The object returned here is "body" in io.socket.get('/say/hello', function gotResponse(body, response)
        return res.ok({
            message: "OK"
        });
    }
};

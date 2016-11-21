(function(w, d, io){
    "use strict";

    if (!d.querySelector('canvas#game')) {
        return;
    }

    io.socket.post('/s/game/register', {}, function(body, response) {
        if (200 !== response.statusCode) {
            d.getElementById('game').innerHTML = body;

            return;
        }

        var canvas = d.querySelector('canvas#game');
        var context = canvas.getContext('2d');
        var is_pressing = false; // Avoids sending key events all the time, saves memory

        /**
         * Game sync.
         * Basically redraws the game canvas.
         */
        io.socket.on('game', function(data){
            console.info('Receiving tick');

            var x = data.x;
            var y = data.y;
            var r = data.r;

            if (isNaN(x) || isNaN(y) || isNaN(r)) {
                return;
            }

            d.getElementById('content').innerHTML = JSON.stringify(data, null, 4);

            context.save();
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.globalAlpha=1;

            context.beginPath();
            context.arc(data.x + 50, data.y + 50, data.r, 0, 2 * Math.PI);
            context.stroke();

            context.restore();
        });

        /**
         * Key events to send via websocket
         */
        d.addEventListener('keydown', function(event){
            if (is_pressing) {
                // Avoids sending this event too often
                return false;
            }

            is_pressing = true;

            io.socket.post('/s/game/keydown', {
                key_code: event.keyCode
            });
        });
        d.addEventListener('keyup', function(event){

            is_pressing = false;

            io.socket.post('/s/game/keyup', {
                key_code: event.keyCode
            });
        });
    });

})(window, window.document, io);

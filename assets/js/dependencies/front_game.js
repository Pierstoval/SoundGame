(function(w, d, io){
    "use strict";

    if (!d.querySelector('canvas#game')) {
        return;
    }

    var canvas = d.querySelector('canvas#game');
    canvas.width = w.innerWidth - 20;
    canvas.height = w.innerHeight - 20;
    canvas.style.width = canvas.width;
    canvas.style.height = canvas.height;
    canvas.style.position = 'absolute';
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.marginLeft = '-'+Math.round(canvas.width/2)+'px';
    canvas.style.marginTop = '-'+Math.round(canvas.height/2)+'px';
    var context = canvas.getContext('2d');

    io.socket.post('/s/game/register', {
        width: canvas.width,
        height: canvas.height
    }, function(body, response) {
        if (200 !== response.statusCode) {
            d.getElementById('game').innerHTML = body;

            return;
        }
        var is_pressing = {}; // Avoids sending key events all the time for the same key, saves memory
        var circlePerimeter = 2 * Math.PI; // Avoids recalculating it on every request

        /**
         * Game sync.
         * Basically redraws the game canvas.
         */
        io.socket.on('game', function(data){
            console.info('Receiving tick');

            var x = data.x;
            var y = data.y;
            var r = data.r;
            var angle = data.a;

            if (isNaN(x) || isNaN(y) || isNaN(r)) {
                return;
            }

            d.getElementById('content').innerHTML = JSON.stringify(data, null, 4);

            context.save();
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.globalAlpha=1;

            context.beginPath();
            context.arc(data.x, data.y, data.r, 0, circlePerimeter);
            context.stroke();

            var angleRadians = angle * (Math.PI / 180);
            var nextPointX = x + 4 * data.s * Math.sin(angleRadians);
            var nextPointY = y + 4 * data.s * Math.cos(angleRadians);

            context.beginPath();
            context.moveTo(data.x, data.y);
            context.lineTo(nextPointX, nextPointY);
            context.stroke();

            context.restore();
        });

        /**
         * Key events to send via websocket
         */
        d.addEventListener('keydown', function(event){
            if (is_pressing[event.keyCode]) {
                // Avoids sending this event too often for the same key
                // (and avoids some hack too, even if we're clien-side here...)
                return false;
            }

            is_pressing[event.keyCode] = true;

            io.socket.post('/s/game/keydown', {
                key_code: event.keyCode
            });
        });
        d.addEventListener('keyup', function(event){
            is_pressing[event.keyCode] = false;

            io.socket.post('/s/game/keyup', {
                key_code: event.keyCode
            });
        });
    });

})(window, window.document, io);

(function(w, d, io){
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

        io.socket.on('game', function(data){
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
    });

})(window, window.document, io);

(function (w, d, io) {
    "use strict";

    if (!d.querySelector('canvas#game')) {
        return;
    }

    var internalImage = function (image, centerPoint) {
        this.getImage       = function () {
            return image;
        };
        this.getCenterPoint = function () {
            return centerPoint;
        };
    };

    /**
     *
     * @param context
     * @param x
     * @param y
     * @param angleRadians
     * @param {internalImage} internalImage
     */
    function drawImage(context, x, y, angleRadians, internalImage) {
        // Make vars "safe"
        x            = x || 0;
        y            = y || 0;
        angleRadians = angleRadians || 0;

        // Draw
        context.save();
        context.moveTo(x, y);
        context.translate(x, y);
        context.rotate(angleRadians);
        context.translate(internalImage.getCenterPoint().x, internalImage.getCenterPoint().y);
        context.drawImage(internalImage.getImage(), 0, 0);
        context.restore();
    }

    var canvas              = d.querySelector('canvas#game');
    canvas.width            = w.innerWidth - 20;
    canvas.height           = w.innerHeight - 20;
    canvas.style.width      = canvas.width;
    canvas.style.height     = canvas.height;
    canvas.style.position   = 'absolute';
    canvas.style.top        = '50%';
    canvas.style.left       = '50%';
    canvas.style.marginLeft = '-' + Math.round(canvas.width / 2) + 'px';
    canvas.style.marginTop  = '-' + Math.round(canvas.height / 2) + 'px';
    var context             = canvas.getContext('2d');

    io.socket.post('/s/game/register', {
        width:  canvas.width,
        height: canvas.height
    }, function (body, response) {
        // On register

        if (200 !== response.statusCode) {
            d.getElementById('game').innerHTML = body;

            return;
        }

        console.info('Registrated successfully!');
        console.info(body, response);

        var sounds = body.assets.sounds;
        console.info(sounds);

        function playSound(sound) {
            if (!sounds[sound]) {
                console.error('Sound "' + sound + '" does not exist.');
                return;
            }
            (new Audio(sounds[sound])).play();
        }

        var is_pressing = {}; // Avoids sending key events all the time for the same key, saves memory
        var images      = {}; // Store Image objects in order to re-use them when needed.

        /**
         * Game sync.
         * Basically redraws the game canvas.
         */
        io.socket.on('game', function (data) {
            var imageObj, i, l;

            var x            = data.x;
            var y            = data.y;
            var radius       = data.r;
            var angle        = data.a;
            var imageUrl     = data.i;
            var notesArray   = data.n;
            var soundsToPlay = data.snd;

            console.info('Receiving tick');

            if (isNaN(x) || isNaN(y) || isNaN(radius)) {
                return;
            }

            d.getElementById('content').innerHTML = JSON.stringify(data, null, 4);

            // Clear the whole canvas to redraw it
            context.save();
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.globalAlpha = 1;
            context.restore();

            var angleRadians = angle * (Math.PI / 180);

            for (i = 0, l = soundsToPlay.length; i < l; i++) {
                playSound(soundsToPlay[i]);
            }

            // Draw user pick
            if (images[imageUrl]) {
                drawImage(context, x, y, -1 * angleRadians, images[imageUrl]);
            } else {
                imageObj        = new Image();
                imageObj.src    = imageUrl;
                imageObj.onload = function () {
                    images[imageUrl] = new internalImage(this, {
                        x: -1 * this.width / 2,
                        y: -1 * this.height / 10
                    });
                    drawImage(context, x, y, -1 * angleRadians, images[imageUrl]);
                };
            }

            // Draw notes
            for (i = 0, l = notesArray.length; i < l; i++) {
                var note = notesArray[i];
                if (images[note.i]) {
                    drawImage(context, note.x, note.y, 0, images[note.i]);
                } else {
                    imageObj        = new Image();
                    imageObj._note  = note;
                    imageObj.src    = note.i;
                    imageObj.onload = function () {
                        console.info('note', this);
                        images[this._note.i] = new internalImage(this, {
                            x: -1 * this.width / 2,
                            y: -1 * this.height / 10
                        });
                        drawImage(context, this._note.x, this._note.y, 0, images[this._note.i]);
                    };
                }
            }
        });

        /**
         * Key events to send via websocket
         */
        d.addEventListener('keydown', function (event) {
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
        d.addEventListener('keyup', function (event) {
            is_pressing[event.keyCode] = false;

            io.socket.post('/s/game/keyup', {
                key_code: event.keyCode
            });
        });
    });

})(window, window.document, io);

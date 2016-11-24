(function (w, d, io) {
    "use strict";

    var canvas, context;

    if (!d.querySelector('canvas#game')) {
        return;
    }

    /**
     * @class
     * @param {Image} image
     * @param {Object} centerPoint
     */
    function InternalImage(image, centerPoint) {
        this.getImage       = function () {
            return image;
        };
        this.getCenterPoint = function () {
            return centerPoint;
        };
    }

    /**
     * @function
     * @param {string} sound
     * @param {number} delay
     * @param {Object} sounds
     */
    function playSound(sound, delay, sounds) {
        if (!sounds[sound]) {
            console.error('Sound "' + sound + '" does not exist.');
            return;
        }

        if (delay) {
            setTimeout(function(){(new Audio(sounds[sound])).play()}, delay);
        } else {
            (new Audio(sounds[sound])).play();
        }
    }

    /**
     * @function
     * @param {CanvasRenderingContext2D} context
     * @param {integer} x
     * @param {integer} y
     * @param {float} angleRadians
     * @param {InternalImage} internalImage
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

    // Create empty canvas at first
    canvas                = d.querySelector('canvas#game');
    context               = canvas.getContext('2d');
    canvas.style.position = 'absolute';
    canvas.style.top      = '50%';
    canvas.style.left     = '50%';

    io.socket.post('/s/game/register', {}, function (gameData, response) {
        var is_pressing, images, soundsReferences, rendered;
        // On register

        if (200 !== response.statusCode) {
            d.getElementById('game').innerHTML = gameData;

            return;
        }

        // Fix canvas size according to map informations
        canvas.width            = gameData.map.width;
        canvas.height           = gameData.map.height;
        canvas.style.width      = gameData.map.width;
        canvas.style.height     = gameData.map.height;
        canvas.style.marginLeft = '-' + Math.round(canvas.width / 2) + 'px';
        canvas.style.marginTop  = '-' + Math.round(canvas.height / 2) + 'px';

        soundsReferences = gameData.assets.sounds;

        is_pressing = {}; // Avoids sending key events all the time for the same key, saves memory
        images      = {}; // Store Image objects in order to re-use them when needed.
        rendered    = false;

        /**
         * Game sync.
         * Basically redraws the game canvas.
         */
        io.socket.on('game', function (data) {
            var imageObj, i, l, note;

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

            // d.getElementById('content').innerHTML = JSON.stringify(data, null, 4);

            // Clear the whole canvas to redraw it
            context.save();
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.globalAlpha = 1;
            context.restore();

            var angleRadians = angle * (Math.PI / 180);

            for (i = 0, l = soundsToPlay.length; i < l; i++) {
                playSound(soundsToPlay[i].soundId, soundsToPlay[i].delay, soundsReferences);
            }

            // Draw notes
            for (i = 0, l = notesArray.length; i < l; i++) {
                note = notesArray[i];
                if (images[note.i]) {
                    drawImage(context, note.x, note.y, 0, images[note.i]);
                } else {
                    imageObj        = new Image();
                    imageObj._note  = note;
                    imageObj.src    = note.i;
                    imageObj.onload = function () {
                        images[this._note.i] = new InternalImage(this, {
                            x: -1 * this.width / 2,
                            y: -1 * this.height / 10
                        });
                        drawImage(context, this._note.x, this._note.y, 0, images[this._note.i]);
                    };
                }
            }

            // Draw user pick
            if (images[imageUrl]) {
                drawImage(context, x, y, -1 * angleRadians, images[imageUrl]);
            } else {
                imageObj        = new Image();
                imageObj.src    = imageUrl;
                imageObj.onload = function () {
                    images[imageUrl] = new InternalImage(this, {
                        x: -1 * this.width / 2,
                        y: -1 * this.height / 10
                    });
                    drawImage(context, x, y, -1 * angleRadians, images[imageUrl]);
                };
            }

            if (!rendered) {
                io.socket.post('/s/game/set_rendered', {}, function(body, response) {
                    rendered = true;
                });
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

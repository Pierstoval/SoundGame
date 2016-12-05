let GameModels = require('./GameModels');
let Helpers    = require('./Helpers');

/**
 * @module Drawer
 */
module.exports = {

    // In milliseconds
    fallbackInterval: 20,

    // Responsible for storing the value of the interval id or the request animation frame id
    eventId: null,

    // A simple diff will be made on each tick with this var,
    //  so the client is lighter and draws only the necessary elements
    lastData: null,

    /**
     * @param {Game} game
     */
    startDrawing: function (game) {
        let _this = this;

        if (null !== this.eventId) {
            console.error('Already drawing. Please use "Drawer.stopDrawing()" to stop, before starting to draw again.');
            return;
        }

        this.eventId = setInterval(function () {
            _this.draw.apply(_this, [game]);
        }, this.fallbackInterval);

        // Draw the background right at the beginning, and only once, because it's static
        this.drawBackground(game);
    },

    stopDrawing: function () {
        if (null === this.eventId) {
            console.warn('Not drawing.');
            return;
        }

        clearInterval(this.eventId);

        this.eventId = null;
    },

    /**
     * @param {Game} game
     */
    draw: function (game) {
        let stringData = JSON.stringify(game.data, null, 4);

        if (this.lastData) {
            if (stringData === this.lastData) {
                // Don't redraw if data has not changed.
                return;
            }
            if (document.getElementById('debug')) {
                document.getElementById('debug').innerHTML = stringData;
            }
        }

        this.lastData = stringData;

        /**
         * @type {CanvasRenderingContext2D}
         */
        let world     = game.worldContext;
        let images    = game.data.level.images;
        let pickImage = game.data.pick.imageUrl;
        let angle     = game.data.pick.angle;
        let x         = game.data.pick.x;
        let y         = game.data.pick.y;
        let radius    = game.data.pick.radius;
        let speed     = game.data.pick.speed;

        // Clear the whole canvas to redraw it
        world.save();
        world.clearRect(0, 0, game.world.width, game.world.height);
        world.globalAlpha = 0;
        world.restore();

        // Draw user pick
        this.drawBlurryCircle(world, x, y, radius, 3 * radius);

        // Draw a line to know which angle we are facing
        let angleRadians = angle * (Math.PI / 180);

        let nextX = x + (radius * speed * Math.sin(angleRadians));
        let nextY = y + (radius * speed * Math.cos(angleRadians));

        world.beginPath();
        world.moveTo(x, y);
        world.lineTo(nextX, nextY);
        world.stroke();

        /*
        if (images[pickImage]) {
            Helpers.drawImage(world, x, y, -1 * angleRadians, images[pickImage]);
        } else {
            let imageObj    = new Image();
            imageObj.src    = pickImage;
            imageObj.onload = function () {
                game.data.level.images[pickImage] = new GameModels.InternalImage(this, {
                    x: -1 * this.width / 2,
                    y: -1 * this.height / 10
                });
                Helpers.drawImage(world, x, y, -1 * angleRadians, images[pickImage]);
            };
        }
        */
    },

    drawBlurryCircle: function (context, x, y, radius, blur) {
        context.save();
        context.shadowBlur    = blur;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        context.strokeStyle = '#FF0000';
        context.fillStyle   = "#FF0000";
        context.shadowColor = "#0000FF"; //set the shadow colour to that of the fill

        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2, true);
        context.fill();
        context.stroke();

        context.restore();
    },

    /**
     * @param {Game} game
     */
    drawBackground: function (game) {
        // Draw notes in the background
        this.drawNotes(game);
    },

    /**
     * @param {Game} game
     */
    drawNotes: function (game) {
        /**
         * @type {CanvasRenderingContext2D}
         */
        let backgroundContext = game.backgroundContext;
        let notes             = game.data.level.notes;
        let images            = game.data.level.images;

        // Draw notes
        for (let i = 0, l = notes.length; i < l; i++) {
            // Notes are serialized, so we need to remember that properties are shortened ones coming from the app
            let note = notes[i];

            if (images[note.i]) {
                Helpers.drawImage(backgroundContext, note.x, note.y, 0, images[note.i]);
            } else {
                let imageObj    = new Image();
                imageObj._note  = note;
                imageObj.src    = note.i;
                imageObj.onload = function () {
                    game.data.level.images[this._note.i] = new GameModels.InternalImage(this, {
                        x: -1 * this.width / 2,
                        y: -1 * this.height / 10
                    });
                    Helpers.drawImage(backgroundContext, this._note.x, this._note.y, 0, images[this._note.i]);
                };
            }
        }

    }
};

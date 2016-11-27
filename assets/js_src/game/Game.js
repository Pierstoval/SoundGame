/**
 * Only here to apply constructor to "Game.init()"
 *
 * @constructor
 */
let Game = function () {
    this.init.apply(this, arguments);
};

let Helpers    = require('./Helpers');
let GameModels = require('./GameModels');

Game.prototype = {

    document: null,

    background:        null,
    backgroundContext: null,

    world:        null,
    worldContext: null,

    ui:        null,
    uiContext: null,

    io: null,

    assets: {
        images: {},
        sounds: {},
    },

    // Avoids sending key events all the time for the same key, saves memory
    pressed_keys: {},

    rendered: false,

    start: function () {
        let _this = this;

        this.io.socket.post('/s/game/register', {}, function () {
            _this.register.apply(_this, arguments);
        });
    },

    /**
     * @constructor
     * @param {Document} document
     * @param {Object} io
     */
    init: function (document, io) {
        this.io       = io;
        this.document = document;

        if (!this.io || (this.io && !this.io.socket) || !(this.document instanceof Document)) {
            console.error('Game dependencies not injected properly');
        }
    },

    /**
     * This is the callback that has to be executed right after the registration was made via websocket.
     *
     * @param {Object} gameData
     * @param {Object} response
     */
    register: function (gameData, response) {
        let _this = this;

        if (200 !== response.statusCode) {
            console.error(
                'Could not initialize game socket registration.' + "\n" +
                'Server responded with status code ' + response.statusCode,
                gameData
            );

            return;
        }

        this.initCanvases(gameData);

        this.assets.sounds = gameData.assets.sounds;

        /**
         * Game sync.
         * Basically redraws the game canvas.
         */
        this.io.socket.on('game', function () {
            _this.tick.apply(_this, arguments);
        });

        this.initListeners();
    },

    /**
     * Initializes the different canvases so they are the same size.
     * This is important because they will all have transparent background so we can see every layer of the canvas.
     *
     * @param {Object} gameData
     */
    initCanvases: function (gameData) {
        let canvasNames = ['world', 'background', 'ui'];
        // Fix canvases size and style according to map informations
        for (let i = 0, l = canvasNames.length; i < l; i++) {
            let canvasName = canvasNames[i];

            let canvas = document.querySelector('canvas#' + canvasName);

            // Setup size both for html tag and canvas drawing area
            canvas.width        = gameData.map.width;
            canvas.height       = gameData.map.height;
            canvas.style.width  = gameData.map.width;
            canvas.style.height = gameData.map.height;

            // Center canvas horizontally
            canvas.style.marginLeft = '-' + Math.round(canvas.width / 2) + 'px';
            canvas.style.marginTop  = '-' + Math.round(canvas.height / 2) + 'px';
            canvas.style.position   = 'absolute';

            this[canvasName]             = canvas;
            this[canvasName + 'Context'] = canvas.getContext('2d');
        }

        let bg = this.background;

        bg.parentElement.style.width  = bg.width + 'px';
        bg.parentElement.style.height = bg.height + 'px';
    },

    /**
     * Callback executed each time we receive a "game" event via websocket.
     *
     * @param {Object} data
     */
    tick: function (data) {
        let imageObj, i, l, note;

        let _this        = this;
        let x            = data.x;
        let y            = data.y;
        let radius       = data.r;
        let angle        = data.a;
        let imageUrl     = data.i;
        let notesArray   = data.n;
        let soundsToPlay = data.snd;
        let world        = this.world;
        let worldContext = this.worldContext;

        console.info('Receiving tick');

        if (isNaN(x) || isNaN(y) || isNaN(radius)) {
            return;
        }

        // document.getElementById('content').innerHTML = JSON.stringify(data, null, 4);

        // Clear the whole canvas to redraw it
        worldContext.save();
        worldContext.clearRect(0, 0, world.width, world.height);
        worldContext.globalAlpha = 0;
        worldContext.restore();

        let angleRadians = angle * (Math.PI / 180);

        for (i = 0, l = soundsToPlay.length; i < l; i++) {
            Helpers.playSound(soundsToPlay[i].soundId, soundsToPlay[i].delay, this.assets.sounds);
        }

        // Draw notes
        for (i = 0, l = notesArray.length; i < l; i++) {
            note = notesArray[i];
            if (this.assets.images[note.i]) {
                Helpers.drawImage(worldContext, note.x, note.y, 0, this.assets.images[note.i]);
            } else {
                imageObj        = new Image();
                imageObj._note  = note;
                imageObj.src    = note.i;
                imageObj.onload = function () {
                    _this.assets.images[this._note.i] = new GameModels.InternalImage(this, {
                        x: -1 * this.width / 2,
                        y: -1 * this.height / 10
                    });
                    Helpers.drawImage(worldContext, this._note.x, this._note.y, 0, _this.assets.images[this._note.i]);
                };
            }
        }

        // Draw user pick
        if (this.assets.images[imageUrl]) {
            Helpers.drawImage(worldContext, x, y, -1 * angleRadians, this.assets.images[imageUrl]);
        } else {
            imageObj        = new Image();
            imageObj.src    = imageUrl;
            imageObj.onload = function () {
                _this.assets.images[imageUrl] = new GameModels.InternalImage(this, {
                    x: -1 * this.width / 2,
                    y: -1 * this.height / 10
                });
                Helpers.drawImage(worldContext, x, y, -1 * angleRadians, _this.assets.images[imageUrl]);
            };
        }

        if (!this.rendered) {
            this.io.socket.post('/s/game/set_rendered', {}, function (body, response) {
                _this.rendered = true;
            });
        }

    },

    initListeners: function () {
        let game = this;

        /**
         * Key events to send via websocket
         */
        this.document.addEventListener('keydown', function (event) {
            if (game.pressed_keys[event.keyCode]) {
                // Avoids sending this event too often for the same key
                // (and avoids some hacks too, even if we're clien-side here...)
                return false;
            }

            game.pressed_keys[event.keyCode] = true;

            game.io.socket.post('/s/game/keydown', {
                key_code: event.keyCode
            });
        });

        this.document.addEventListener('keyup', function (event) {
            game.pressed_keys[event.keyCode] = false;

            game.io.socket.post('/s/game/keyup', {
                key_code: event.keyCode
            });
        });
    }
};

/**
 * @module Game
 */
module.exports = Game;

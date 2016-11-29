/**
 * Only here to apply constructor to "Game.init()"
 *
 * @constructor
 */
let Game = function () {
    this.__construct.apply(this, arguments);
};

let Helpers    = require('./Helpers');
let GameModels = require('./GameModels');
let Drawer     = require('./Drawer');

Game.prototype = {

    document: null,

    background:        null,
    backgroundContext: null,

    world: null,

    worldContext: null,

    ui:        null,
    uiContext: null,

    io: null,

    // Avoids sending key events all the time for the same key, saves memory
    pressed_keys: {},

    rendered: false,

    // Mutable data that are used for drawing purpose
    data: {
        soundsToPlay: [],
        pick:         {
            x:        0,
            y:        0,
            radius:   0,
            angle:    0,
            imageUrl: '',
        },
        map:          {
            width:  0,
            height: 0,
        },
        level:        {
            images: {},
            sounds: {},
            notes:  {},
        },
    },

    /**
     * @constructor
     * @param {Window} window
     * @param {Object} io
     */
    __construct: function (window, io) {
        this.io       = io;
        this.window   = window || {};
        this.document = window.document;

        if (!this.io || (this.io && !this.io.socket) || !(this.window instanceof Window) || !(this.document instanceof HTMLDocument)) {
            console.error('Game dependencies not injected properly');
        }
    },

    /**
     * To be executed once instanciated
     */
    start: function () {
        let _this = this;

        this.io.socket.post('/s/game/register', {}, function () {
            _this.register.apply(_this, arguments);
        });

        this.io.socket.on('disconnect', function () {
            Drawer.stopDrawing();
        });
    },

    /**
     * This is the callback that has to be executed right after the registration was made via websocket.
     * GameData is serialized from the app.
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

        this.data.map.width  = gameData.w;
        this.data.map.height = gameData.h;

        this.data.level.name   = gameData.ln;
        this.data.level.sounds = gameData.s;
        this.data.level.images = gameData.i;
        this.data.level.notes  = gameData.n;

        this.initCanvases();

        let images               = this.data.level.images;
        let sounds               = this.data.level.sounds;
        let numberOfImages       = images.length;
        let numberOfLoadedImages = 0;

        // We nest callbacks here because we need all components to be loaded before we start the game.
        // Load game only when images and sounds are loaded.
        for (let i = 0; i < numberOfImages; i++) {
            let image = new Image();

            // ========================
            // Start callback
            image.onload = function () {
                numberOfLoadedImages++;
                // First, load images. When loaded, load sounds.
                if (numberOfLoadedImages === numberOfImages) {

                    let numberOfAudio       = 0;
                    let numberOfLoadedAudio = 0;

                    for (let soundId in sounds) {
                        if (!sounds.hasOwnProperty(soundId)) {
                            continue;
                        }
                        numberOfAudio++;
                    }
                    for (let soundId in sounds) {
                        if (!sounds.hasOwnProperty(soundId)) {
                            continue;
                        }
                        let audio = new Audio(sounds[soundId]);

                        // ========================
                        // Start callback
                        audio.addEventListener('canplaythrough', function () {
                            numberOfLoadedAudio++;
                            if (numberOfLoadedAudio === numberOfAudio) {
                                // Finally !
                                // Now we can set up the tick event received from the server.
                                _this.io.socket.on('game', function (data) {
                                    _this.tick.call(_this, data);
                                });

                                Drawer.startDrawing(_this);

                                _this.initListeners();
                            }
                        }, false);
                        // ========================
                    }

                }
            };
            // ========================
            image.src    = images[i];
        }

    },

    /**
     * Initializes the different canvases so they are the same size.
     * This is important because they will all have transparent background so we can see every layer of the canvas.
     */
    initCanvases: function () {
        let canvasNames = ['world', 'background', 'ui'];

        // Fix canvases size and style according to map informations
        for (let i = 0, l = canvasNames.length; i < l; i++) {
            let canvasName = canvasNames[i];

            let canvas = document.querySelector('canvas#' + canvasName);

            // Setup size both for html tag and canvas drawing area
            canvas.width        = this.data.map.width;
            canvas.height       = this.data.map.height;
            canvas.style.width  = this.data.map.width;
            canvas.style.height = this.data.map.height;

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
        let _this = this;

        // Update game data
        this.data.pick.x        = data.x;
        this.data.pick.y        = data.y;
        this.data.pick.radius   = data.r;
        this.data.pick.angle    = data.a;
        this.data.pick.imageUrl = data.i;
        this.data.soundsToPlay  = data.snd;

        let sounds       = this.data.level.sounds;
        let soundsToPlay = this.data.soundsToPlay;

        // Play sounds that have to be played
        for (let i = 0, l = soundsToPlay.length; i < l; i++) {
            Helpers.playSound(soundsToPlay[i].soundId, soundsToPlay[i].delay, sounds);
        }
        this.data.soundsToPlay = [];

        if (!this.rendered) {
            this.io.socket.post('/s/game/set_rendered', {}, function (body, response) {
                _this.rendered = true;
            });
        }

    },

    initListeners: function () {
        let game = this;

        const keyMovements = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

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

            if (keyMovements[event.keyCode]) {
                event.preventDefault();
            }
        });

        this.document.addEventListener('keyup', function (event) {
            game.pressed_keys[event.keyCode] = false;

            game.io.socket.post('/s/game/keyup', {
                key_code: event.keyCode
            });

            if (keyMovements[event.keyCode]) {
                event.preventDefault();
            }
        });
    }
};

/**
 * @module Game
 */
module.exports = Game;

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

        this.data.internalImages = {};

        let images = this.data.level.images;

        // Add pick to internal images for it to be loaded too
        if (gameData.u.i) {
            images.push(gameData.u.i);
        }

        this.data.images = images;

        this.initCanvases();

        this.loadImages(images, function () {
            // This callback is executed at the end of the loading chain.
            // With this, the game starts only when all assets are loaded.

            // Refresh game data on every tick
            _this.io.socket.on('game', function (data) {
                _this.tick.call(_this, data);
            });

            // Start the drawer loop
            Drawer.startDrawing(_this);

            // Initialize key/touch listeners
            _this.initListeners();
        });

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
     * Load images and execute final callback
     *
     * @param {Array}    images
     * @param {Function} cb
     */
    loadImages: function (images, cb) {
        let _this = this;
        let numberOfImages       = images.length;
        let numberOfLoadedImages = 0;

        // Load game only when images and sounds are loaded.
        for (let i = 0; i < numberOfImages; i++) {
            let image = new Image();
            let imageUrl = images[i];

            // ========================
            // Start callback
            image.onload = function () {

                _this.data.internalImages[imageUrl] = new GameModels.InternalImage(this, {
                    x: -1 * Math.round(this.width / 2),
                    y: -1 * Math.round(this.height / 2)
                });

                numberOfLoadedImages++;

                // First, load images. When loaded, load sounds.
                if (numberOfLoadedImages === numberOfImages) {
                    _this.loadSounds(cb);
                }
            };
            // ========================

            image.src = imageUrl;
        }
    },

    /**
     * Load sounds and execute final callback

     * @param {Function} cb
     */
    loadSounds: function (cb) {
        let numberOfAudio       = 0;
        let numberOfLoadedAudio = 0;
        let sounds              = this.data.level.sounds;

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

                    // ================
                    // Start the game HERE
                    // ================
                    cb();
                }
            }, false);
            // ========================
        }

    },

    /**
     * Callback executed each time we receive a "game" event via websocket.
     *
     * @param {Object} data
     */
    tick: function (data) {
        let _this = this;

        // Update game data
        this.data.pick.x          = Math.round(data.x);
        this.data.pick.y          = Math.round(data.y);
        this.data.pick.radius     = data.r;
        this.data.pick.angle      = data.a;
        this.data.pick.speed      = data.s;
        this.data.pick.moveRatio  = data.mr;
        this.data.pick.imageUrl   = data.i;
        this.data.pick.spriteSize = data.isz;
        this.data.pick.sprite     = data.is;
        this.data.soundsToPlay    = data.snd;
        this.data.numberOfTicks   = data.nt;

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

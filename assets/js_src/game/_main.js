// Should be dumped to js/app.js
(function (w, d, io) {
    "use strict";

    let Game = require('./Game');

    let game = new Game(d, io);

    game.start();

})(window, window.document, io);

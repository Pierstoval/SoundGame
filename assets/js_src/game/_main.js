let Game = require('./Game');
// Should be dumped to js/app.js
(function (w, io) {

    try {
        new Game(w, io).start();
    } catch (e) {
        console.error('Exception occured in game');
        console.error(e);
    }

})(window, io);

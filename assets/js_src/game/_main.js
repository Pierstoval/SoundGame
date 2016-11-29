let Game = require('./Game');
// Should be dumped to js/app.js
(function (w, io) {

    new Game(w, io).start();

})(window, io);

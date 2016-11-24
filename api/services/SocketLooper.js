/**
 * Loop that will be used to synchronize every users with the game engine.
 * To save a bit of memory, loop is disabled when there is no user connected to the game.
 * @namespace SocketLooper
 */
module.exports = {

    // In milliseconds (but won't be "live" milliseconds actually)
    tickInterval: 10,

    // This var allows us to know how many ticks we executed
    // On a 64 bits system, it can go up to thousands of years...
    numberOfTicks: 0,

    // If one tick is longer than the others, this prevents any concurrent tick
    ticking: false,

    interval: null,

    lastSecond: null,
    lastSecondTicks: null,

    init: function(){
        this.startLoop();
    },

    startLoop: function(){
        this.tick();
        this.interval = setInterval(this.tick, this.tickInterval);
    },

    stopLoop: function(){
        clearInterval(this.interval);
        this.interval = null;
    },

    /**
     * This method is called in GameEngine.js every time a user is added or removed.
     */
    revalidateStatus: function(){
        let numberOfUsers = Object.keys(GameEngine.users).length;

        // Lighten memory by disabling loops if there is no user connected to the game.
        if (0 === numberOfUsers) {
            this.stopLoop();
        } else if (!this.interval) {
            this.startLoop();
        }
    },

    tick: function(){

        this.checkSeconds();

        if (this.ticking) {
            return;
        }

        this.ticking = true;

        // Count number of occurrences for the Tick
        this.numberOfTicks++;

        GameEngine.refreshClients();

        this.ticking = false;
    },

    // Allow us to debug
    checkSeconds: function(){
        var d = new Date(),
            second = d.getSeconds();

        if (null === this.lastSecond) {
            this.lastSecond = second;
            this.lastSecondTicks = this.numberOfTicks;
            return;
        }

        if (this.lastSecond !== second) {
            // console.info('Executed '+(this.numberOfTicks-this.lastSecondTicks)+' ticks last second.');
            this.lastSecond = second;
            this.lastSecondTicks = this.numberOfTicks;
        }
    }
};

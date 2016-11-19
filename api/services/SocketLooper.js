
module.exports = {

    tickInterval: 1000,

    // These vars allow us to know how many ticks we executed
    maxInt: MAX_INT = Math.pow(2, 53),
    tickNumber: 0,
    tickInfinityCalls: 0,

    // If one tick is longer than the others, this prevents any concurrent tick
    ticking: false,

    timeout: null,

    startLoop: function(){
        this.tick();
        this.timeout = setInterval(this.tick, this.tickInterval);
    },

    stopLoop: function(){
        clearInterval(this.timeout);
    },

    tick: function(){

        if (this.ticking) {
            return;
        }

        this.ticking = true;

        // Count number of occurrences for the Tick
        this.tickNumber++;

        if (this.tickNumber === this.MAX_INT) {
            this.tickNumber = 0;
            this.tickInfinityCalls++;
        }

        console.info(new Date, 'Tick '+this.tickInfinityCalls+'-'+this.tickNumber);

        sails.sockets.broadcast('home', 'home', {'message':'Ticking hello message.'});

        this.ticking = false;
    }
};

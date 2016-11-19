
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
        this.timeout = setInterval(this.tick, this.tickInterval);
    },

    stopLoop: function(){
        clearInterval(this.timeout);
    },

    tick: function(){
        console.info('Ticking');
        console.info('Sockets : ', sails.sockets.subscribers());
    }
};

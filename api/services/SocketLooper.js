module.exports = {

    tickInterval: 1000,

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

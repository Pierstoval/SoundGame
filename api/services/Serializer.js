module.exports = {
    serializeUser: function (user) {
        return {
            x: user.pick.x,
            y: user.pick.y,
            r: user.pick.r,
        };
    }
};

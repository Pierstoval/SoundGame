"use strict";

/**
 * Loads user from database when we have user id in session
 */
module.exports = function flashMessages(sails) {
    return {
        routes: {
            before: {
                'all /*': function (req, res, next) {

                    if (req.session.me) {
                        return User.findOne({
                            id: req.session.me
                        }).exec(function(err, user) {
                            if (!user) {
                                req.session.me = null;
                                req.user = null;
                                return next();
                            }

                            req.user = user;

                            next();
                        })
                    }

                    return next();
                }
            }
        }
    }
};

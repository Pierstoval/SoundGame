"use strict";

let _session_key = 'flash';

/**
 * Handle flash messages.
 * This hook adds some methods in the Request object that allow you to add, remove, or get flash messages.
 */
module.exports = function flashMessages(sails) {
    return {
        routes: {
            before: {
                'all /*': function (req, res, next) {
                    let session = req.session;

                    if (!session) {
                        return;
                    }

                    if (typeof session[_session_key] === 'undefined') {
                        session[_session_key] = {};
                    }

                    let add = function (type, message) {
                        if (!this.hasFlash(type)) {
                            session[_session_key][type] = [];
                        }
                        session[_session_key][type].push(message);
                        return this;
                    };

                    let all = function () {
                        let messages          = session[_session_key] || [];
                        session[_session_key] = {};
                        return messages;
                    };

                    let get = function (type) {
                        let messages = [];
                        if (this.hasFlash(type)) {
                            messages = session[_session_key][type];
                            delete session[_session_key][type];
                        }
                        return messages || [];
                    };

                    let has = function (type) {
                        return (typeof session[_session_key][type] !== 'undefined');
                    };

                    req.addFlash    = add;
                    req.getFlash    = get;
                    req.hasFlash    = has;
                    req.getAllFlash = all;

                    return next();
                }
            }
        }
    }
};

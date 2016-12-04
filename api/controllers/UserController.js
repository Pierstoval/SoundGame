/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    login: function (req, res) {
        if ('GET' === req.method) {
            return res.view('front/auth/login');
        }

        return res.login({
            usernameOrEmail: req.param('username_or_email'),
            password:        req.param('password'),
            successRedirect: '/',
            invalidRedirect: '/login'
        });
    },

    /**
     * `UserController.logout()`
     */
    logout: function (req, res) {

        // "Forget" the user from the session.
        // Subsequent requests from this user agent will NOT have `req.session.me`.
        req.session.me = null;
        req.user = null;

        // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
        // send a simple response letting the user agent know they were logged out
        // successfully.
        if (req.wantsJSON) {
            return res.ok('Logged out successfully!');
        }

        // Otherwise if this is an HTML-wanting browser, do a redirect.
        return res.redirect('/');
    },

    /**
     * `UserController.register()`
     */
    register: function (req, res) {

        if ('POST' === req.method) {
            // Attempt to register a user using the provided parameters
            User.register({
                username: req.param('username'),
                email:    req.param('email'),
                password: req.param('password')
            }, function (err, user) {
                if (err) {
                    let errorsToReturn = [];

                    if (err.invalidAttributes) {
                        let errors = err.invalidAttributes;
                        if (errors.username) {
                            errorsToReturn.push(sails.__('errors_validation_username'));
                        }
                        if (errors.password) {
                            errorsToReturn.push(sails.__('errors_validation_password'));
                        }
                        if (errors.email) {
                            errorsToReturn.push(sails.__('errors_validation_email'));
                        }
                    }

                    return res.view('front/auth/register', { errors: errorsToReturn });
                }

                // Go ahead and log this user in as well.
                // We do this by "remembering" the user in the session.
                // Subsequent requests from this user agent will have `req.session.me` set.
                req.session.me = user.id;

                // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
                // send a 200 response letting the user agent know the register was successful.
                if (req.wantsJSON) {
                    return res.ok('Signup successful!');
                }

                // Otherwise if this is an HTML-wanting browser, redirect to /welcome.
                req.addFlash('success', sails.__('registration_success'));

                return res.redirect('/');
            });
        } else {
            return res.view('front/auth/register');
        }
    }
};

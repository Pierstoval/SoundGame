let bcrypt = require('bcrypt');
let uuid   = require('uuid');

/**
 * @namespace User
 */
module.exports = {

    attributes: {

        uuid: {
            type:               'string',
            primaryKey:         true,
            required:           true,
            unique:             true,
            uuidv4:             true,
            alphanumericdashed: true,
            defaultsTo:         function () {
                return uuid.v4();
            }
        },

        username: {
            type:      'string',
            unique:    true,
            required:  true,
            truthy:    true,
            minLength: 4
        },

        email: {
            type:     'email',
            unique:   true,
            required: true,
            truthy:   true,
            email:    true
        },

        password: {
            type:      'string',
            required:  true,
            truthy:    true,
            minLength: 6
        },

        toJSON: function () {
            let obj = this.toObject();
            delete obj.password;
            return obj;
        }

    },

    beforeCreate: function (user, cb) {
        // Only hash the password when the user enters one
        if (!user.password) {
            return cb();
        }
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    user.password = hash;
                    cb();
                }
            });
        });
    },

    /**
     * Create a new user using the provided inputs,
     * but encrypt the password first.
     *
     * @param  {Object}   inputs
     *                     • name     {String}
     *                     • email    {String}
     *                     • password {String}
     * @param  {Function} cb
     */
    register: function (inputs, cb) {
        User
            .create({
                username: inputs.username,
                email:    inputs.email,
                password: inputs.password
            })
            .exec(function (err, user) {
                console.info('user create callback');
                return cb(err, user);
            })
        ;
    },

    /**
     * Check validness of a login using the provided inputs.
     *                                                           But encrypt the password first.
     *
     * @param  {Object}   inputs
     *                     • email    {String}
     *                     • password {String}
     * @param  {Function} cb
     */
    attemptLogin: function (inputs, cb) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(inputs.password, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    // Create a user
                    User
                        .findOne({
                            email:    inputs.email,
                            password: hash
                        })
                        .exec(cb)
                    ;
                }
            });
        });
    }
};

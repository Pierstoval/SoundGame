
let bcrypt = require('bcrypt');
let uuid = require('node-uuid');

/**
 * @namespace User
 */
module.exports = {

    attributes: {

        uuid: {
            type: 'string',
            primaryKey: true,
            required: true,
            unique: true,
            uuidv4: true,
            alphanumericdashed: true,
            defaultsTo: function() {
                return uuid.v4();
            }
        },

        username: {
            type: 'string',
            unique: true,
            minLength: 5
        },

        email: {
            type: 'email',
            unique: true,
            email: true
        },

        password: {
            type: 'string',
            minLength: 6
        },

        picks: {
            collection: 'pick',
            via: 'user'
        },

        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }

    },

    beforeCreate: function(user, cb) {
        // Only hash the password when the user enters one
        if (!user.password) {
            return;
        }
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    user.password = hash;
                    cb();
                }
            });
        });
    }
};

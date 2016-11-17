
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');

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

        name: {
            type: 'string',
            required: true,
            notNull: true,
            unique: true,
            alphanumericdashed: true
        },

        email: {
            type: 'email',
            required: true,
            notNull: true,
            unique: true,
            email: true
        },

        password: {
            type: 'string',
            minLength: 6,
            required: true
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

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
            type: 'string',
            required: true,
            notNull: true,
            unique: true,
            email: true
        },

        game: {
            model: 'game'
        }

    }

};

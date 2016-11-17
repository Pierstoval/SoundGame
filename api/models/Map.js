
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

        pick: {
            model: 'pick'
        }

    }

};

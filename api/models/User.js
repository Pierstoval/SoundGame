var uuid = require('node-uuid');

module.exports = {

    attributes: {
        uuid: {
            type: 'string',
            primaryKey: true,
            required: true,
            defaultsTo: function() {
                return uuid.v4();
            }
        },
        name: {
            type: 'string'
        },
        game: {
            model: 'game'
        }
    },

    findOrCreateNewUser: function(name, callback) {

        // Try to find a user.
        User
            .findOne({name: name.toString()})
            .exec(function(err, user){

                console.info('exec after find');
                console.info(err, user);

                if (!user) {
                    // If user not found, we create one.
                    User.create({name: name}).exec(function(errCreate, userCreate) {
                        if (!userCreate) {
                            return callback(errCreate, userCreate);
                        }

                        userCreate.save();
                        console.info('exec after create');
                        console.info(errCreate, userCreate);

                        return callback(errCreate, userCreate);
                    });
                } else {
                    return callback(errCreate, userCreate);
                }
            })
        ;
    }
};

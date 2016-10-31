module.exports = {
    connection: 'localDiskDb',
    attributes: {
        players: {
            collection: 'user',
            via: 'game'
        }
    }
};

let GameNoteModel = require('../services/GameNoteModel');

module.exports = {
    name: 'Level one',

    mapWidth: 500,
    mapHeight: 500,

    notes: [
        new GameNoteModel(50, 250, '1Do'),
        new GameNoteModel(75, 250, '1Do'),
        new GameNoteModel(100, 250, '1Do'),
        new GameNoteModel(125, 250, '1Re'),
        new GameNoteModel(150, 250, '1Mi'),
        new GameNoteModel(200, 250, '1Re'),
        new GameNoteModel(250, 250, '1Do'),
        new GameNoteModel(275, 250, '1Mi'),
        new GameNoteModel(300, 250, '1Re'),
        new GameNoteModel(325, 250, '1Re'),
        new GameNoteModel(350, 250, '1Do'),
    ],
};

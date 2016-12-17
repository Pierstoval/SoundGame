/**
 * Makes sure elements in an array are unique
 *
 * @param {Array} arr
 * @returns {Array}
 *
 * @link https://github.com/jonschlinkert/array-unique
 */
function arrayUnique(arr) {
    if (!Array.isArray(arr)) {
        throw new TypeError('array-unique expects an array.');
    }

    let len = arr.length;
    let i   = -1;

    while (i++ < len) {
        let j = i + 1;

        for (; j < arr.length; ++j) {
            if (arr[i] === arr[j]) {
                arr.splice(j--, 1);
            }
        }
    }

    return arr;
}

/**
 * A simple value object that can be initialized with a level.
 * Only existing levels will be used, of course.
 * It also automatically handles the assets to load (images and sounds).
 *
 * @namespace LevelModel
 *
 * @property {string} name
 * @property {number} number
 * @property {object} level
 */
module.exports = function (number) {

    number = !isNaN(number) ? parseInt(number, 10) : null;

    if (!number) {
        throw 'Level ' + number + ' does not exist.';
    }

    let level = require('../game_levels/level_' + number);

    let images = [];
    let sounds = [];

    for (let i = 0, l = level.notes.length; i < l; i++) {
        /** @type {GameNoteModel} */
        let gameNote = level.notes[i];

        images.push(gameNote.note.sprite);
        sounds.push(gameNote.note.sound);
    }

    images = arrayUnique(images);
    sounds = arrayUnique(sounds);

    this.name   = level.name;
    this.number = number;
    this.data   = level;
    this.images = images;
    this.sounds = sounds;
};

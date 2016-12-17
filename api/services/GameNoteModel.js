/**
 * This model is a static model that represents a note in the current game.
 * First, note objects are retrieved from static file.
 * Then, we can instantiate any note if its note name exists in the objects list.
 */

let uuid = require('uuid');

let getNote = require('./NoteModel');

/**
 * @namespace GameNoteModel
 * @constructor
 *
 * @param {number} x
 * @param {number} y
 * @param {string} noteName
 * @param {number} soundDelay
 *
 * @property {string} uuid
 * @property {number} x
 * @property {number} y
 * @property {number} radius
 * @property {NoteModel} note
 * @property {string} noteName
 * @property {number} soundDelay
 */
module.exports = function (x, y, noteName, soundDelay) {
    let note = getNote(noteName);

    if (!note) {
        return;
    }

    this.uuid       = uuid.v4();
    this.x          = x;
    this.y          = y;
    this.radius     = 6;
    this.noteName   = noteName;
    this.soundDelay = soundDelay || 0;
    this.note       = note;
};

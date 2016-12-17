let Geometry = require('./Geometry');

/**
 * @namespace CollisionsManager
 */
module.exports = {

    /**
     * @param {PickModel} pick
     * @param {GameNoteModel} note
     *
     * @returns {boolean}
     */
    testPickAndNoteCollide: function (pick, note) {

        // Circle collision equation:
        // d = sqrt( (pick.x − note.x)² + (pick.y − note.y)² )

        // Simplification:
        // d² = (pick.x-note.x) * (pick.x-note.x) + (pick.y-note.y) * (pick.y-note.y)
        // (where d² must be inferior or equal to square of radius' sums:
        // (pick.rayon + note.rayon) * (pick.rayon + note.rayon)

        return ((pick.x - note.x) * (pick.x - note.x) + (pick.y - note.y) * (pick.y - note.y))
            <= ((pick.radius + note.radius) * (pick.radius + note.radius));

    },

};

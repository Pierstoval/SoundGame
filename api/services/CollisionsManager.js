/**
 * @namespace CollisionsManager
 */
module.exports = {

    /**
     * @param {Models.Pick} pick
     * @param {Models.Note} note
     *
     * @returns {boolean}
     */
    testPickAndNoteCollide: function (pick, note) {
        let distanceX, distanceY, pickCircle, noteRectangle;

        pickCircle    = new Geometry.Circle(pick.x, pick.y, pick.radius);
        noteRectangle = new Geometry.Rectangle(note.x, note.y, note.width, note.height);

        // Find the vertical & horizontal (distX/distY) distances between the circle’s center and the rectangle’s center
        distanceX = Math.abs(pickCircle.x - noteRectangle.x - noteRectangle.width / 2);
        distanceY = Math.abs(pickCircle.y - noteRectangle.y - noteRectangle.height / 2);

        // If the distance is greater than halfCircle + halfRect, then they are too far apart to be colliding
        if (
            distanceX > (noteRectangle.width / 2 + pickCircle.radius)
            || distanceY > (noteRectangle.height / 2 + pickCircle.radius)
        ) {
            return false;
        }

        // If the distance is less than halfRect then they are definitely colliding
        if (
            distanceX <= (noteRectangle.width / 2)
            || distanceY <= (noteRectangle.height / 2)
        ) {
            return true;
        }

        //Think of a line from the rect center to any rect corner
        // Now extend that line by the radius of the circle
        // If the circle’s center is on that line they are colliding at exactly that rect corner
        // Using Pythagoras formula to compare the distance between circle and rect centers.

        distanceX = distanceX - noteRectangle.width / 2;
        distanceY = distanceY - noteRectangle.height / 2;

        return (distanceX * distanceX + distanceY * distanceY) <= (pickCircle.radius * pickCircle.radius);
    },

};

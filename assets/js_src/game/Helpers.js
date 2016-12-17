let GameModels = require('./GameModels');

class Helpers {

    /**
     * @param {CanvasRenderingContext2D} context
     * @param {Number} x
     * @param {Number} y
     * @param {float} angleRadians
     * @param {GameModels.InternalImage} internalImage
     */
    static drawImage(context, x, y, angleRadians, internalImage) {
        if (!(internalImage instanceof GameModels.InternalImage)) {
            console.error('Trying to draw something else than an InternalImage object', internalImage);
            return;
        }

        // Make vars "safe"
        x            = Math.round(x || 0);
        y            = Math.round(y || 0);
        angleRadians = angleRadians || 0;

        // Draw
        context.save();
        context.moveTo(x, y);
        context.translate(x, y);
        context.rotate(angleRadians);
        context.translate(internalImage.getCenterPoint().x, internalImage.getCenterPoint().y);
        context.drawImage(internalImage.getImage(), 0, 0);
        context.restore();
    }

    /**
     * @param {GameNoteModel} gameNote
     * @param {Object} sounds
     */
    static playSound(gameNote, sounds) {
        let sound = gameNote.note.sound;
        let delay = gameNote.soundDelay;

        if (sounds.indexOf(sound) < 0) {
            console.error('Sound id "' + gameNote + '" does not exist.');
            return;
        }

        if (delay) {
            setTimeout(function () {
                (new Audio(sound)).play()
            }, delay);
        } else {
            (new Audio(sound)).play();
        }
    }

}

module.exports = Helpers;

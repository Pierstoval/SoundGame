let GameModels = require('./GameModels');

/**
 * @module Helpers
 */
module.exports = {

    /**
     * @function
     * @param {CanvasRenderingContext2D} context
     * @param {Number} x
     * @param {Number} y
     * @param {float} angleRadians
     * @param {GameModels.InternalImage} internalImage
     */
    drawImage: function(context, x, y, angleRadians, internalImage) {
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
    },

    /**
     * @function
     * @param {string} sound
     * @param {number} delay
     * @param {Object} sounds
     */
    playSound: function(sound, delay, sounds) {
        if (!sounds[sound]) {
            console.error('Sound id "' + sound + '" does not exist.');
            return;
        }

        if (delay) {
            setTimeout(function () {
                (new Audio(sounds[sound])).play()
            }, delay);
        } else {
            (new Audio(sounds[sound])).play();
        }
    },

};

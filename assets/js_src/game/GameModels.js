/**
 * @module GameModels
 */
module.exports = {

    /**
     * @class
     * @param {Image} image
     * @param {Object} centerPoint
     */
    InternalImage: function(image, centerPoint) {
        this.getImage       = function () {
            return image;
        };
        this.getCenterPoint = function () {
            return centerPoint;
        };
    },

};

/**
 * @namespace Geometry
 */
module.exports = {
    /**
     * @class
     *
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     *
     * @property {number} x
     * @property {number} y
     * @property {number} radius
     */
    Circle: function(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    },

    /**
     * @class
     *
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     *
     * @property {number} x
     * @property {number} y
     * @property {number} width
     * @property {number} height
     */
    Rectangle: function(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    },
};

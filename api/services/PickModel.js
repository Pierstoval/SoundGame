/**
 * @namespace PickModel
 * @class
 *
 * @param {Object} parameters
 *
 * @property {number} x
 * @property {number} y
 * @property {number} radius
 * @property {number} angle
 * @property {number} speed
 * @property {number} angleSpeed
 * @property {string} imageUrl
 * @property {Array} sprite
 * @property {Object} spriteSize
 * @property {number} spriteSize.width
 * @property {number} spriteSize.height
 * @property {number} moveRatio
 */

module.exports = function (parameters) {
    if (!parameters) {
        parameters = {};
    }

    this.x          = parameters.x;
    this.y          = parameters.y;
    this.radius     = parameters.radius || 8;
    this.angle      = parameters.angle || 90;
    this.speed      = parameters.speed || 1;
    this.angleSpeed = parameters.angleSpeed || 2.5;
    this.imageUrl   = parameters.imageUrl || null;
    this.spriteSize = parameters.spriteSize || { width: 1, height: 1 };
    this.sprite     = parameters.sprite || [];
    this.moveRatio  = 1; // 1 for "forward", -1 for "backwards",
};

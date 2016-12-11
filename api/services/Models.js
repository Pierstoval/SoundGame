
let uuid = require('uuid');

/**
 * Used for plain models that are used in the application.
 *
 * @namespace Models
 */
module.exports = {

    /**
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
     * @property {string|null} imageUrl
     * @property {number} moveRatio
     */
    Pick: function (parameters) {
        if (!parameters) {
            parameters = {};
        }

        this.x          = parameters.x;
        this.y          = parameters.y;
        this.radius     = parameters.radius || 5;
        this.angle      = parameters.angle || 90;
        this.speed      = parameters.speed || 1;
        this.angleSpeed = parameters.angleSpeed || 2.5;
        this.imageUrl   = parameters.imageUrl || null;
        this.moveRatio  = 1; // 1 for "forward", -1 for "backwards",
    },

    /**
     * @class
     *
     * @param {number} x
     * @param {number} y
     * @param {string} imageUrl
     * @param {number} width
     * @param {number} height
     * @param {Models.SoundEvent} soundEvent
     *
     * @property {string} uuid
     * @property {number} x
     * @property {number} y
     * @property {string} imageUrl
     * @property {number} width
     * @property {number} height
     * @property {Models.SoundEvent} soundEvent
     */
    Note: function (x, y, imageUrl, width, height, soundEvent) {
        this.uuid       = uuid.v4();
        this.x          = x;
        this.y          = y;
        this.imageUrl   = imageUrl;
        this.width      = width;
        this.height     = height;
        this.soundEvent = soundEvent;
    },

    /**
     * @class
     *
     * @param {string} soundId
     * @param {number} [delay] optional delay to execute this specific sound
     *
     * @property {string} soundId
     * @property {number} delay
     */
    SoundEvent: function (soundId, delay) {
        this.soundId = soundId;
        this.delay   = delay || 0;
    }
};


let uuid = require('uuid');

/**
 * @namespace Models
 */
module.exports = {

    /**
     * @class
     *
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @param {number} angle in degrees
     * @param {number} speed in pixels per tick
     * @param {number} angleSpeed in degrees per tick
     * @param {string} imageUrl
     *
     * @property {number} x
     * @property {number} y
     * @property {number} radius
     * @property {number} angle
     * @property {number} speed
     * @property {number} angleSpeed
     * @property {string} imageUrl
     */
    Pick: function (x, y, radius, angle, speed, angleSpeed, imageUrl) {
        this.x          = x;
        this.y          = y;
        this.radius     = radius;
        this.angle      = angle;
        this.speed      = speed;
        this.angleSpeed = angleSpeed;
        this.imageUrl   = imageUrl;
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

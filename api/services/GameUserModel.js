/**
 * @namespace GameUserModel
 *
 * @constructor
 *
 * @param {Request} req
 * @param {LevelModel} level
 *
 * @property {string} id
 * @property {boolean} rendered
 * @property {Array} soundsToPlay
 * @property {PickModel} pick
 * @property {{left: boolean, right: boolean, up: boolean, down: boolean}} movements
 * @property {Object} collidingObjects
 * @property {LevelModel} level
 */
module.exports = function (req, level) {
    'use strict';

    this.id           = req.socket.id;
    this.rendered     = false;
    this.soundsToPlay = [];

    this.pick = new PickModel({
        x:          Math.floor(Math.random() * level.data.mapWidth) + 1,
        y:          Math.floor(Math.random() * level.data.mapHeight) + 1,
        imageUrl:   '/images/picks/pick.png',
        spriteSize: { width: 64, height: 64 },
        sprite:     [
            { x: 0, y: 0 },
            { x: 64, y: 0 },
            { x: 128, y: 0 },
            { x: 192, y: 0 },
            { x: 256, y: 0 },
            { x: 320, y: 0 },
            { x: 384, y: 0 },
            { x: 448, y: 0 },
            { x: 512, y: 0 },
            { x: 576, y: 0 },
            { x: 640, y: 0 },
            { x: 704, y: 0 },
            { x: 768, y: 0 },
            { x: 832, y: 0 },
            { x: 896, y: 0 },
            { x: 960, y: 0 },
        ]
    });

    this.pressingMovementKey = false;

    this.collidingObjects = {};

    this.level = level;
};

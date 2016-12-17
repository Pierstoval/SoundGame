/**
 * @namespace Serializer
 */
module.exports = {

    /**
     * @param {GameUserModel} user
     *
     *
     * @returns {{x: number, y: number, r: number, a: number, s: number, i: string, is: Array, isw: number, ish: number, mr: number, snd: Array}} serializedUser
     */
    serializeUser: function (user) {
        return {
            x: user.pick.x,
            y: user.pick.y,
            r: user.pick.radius,
            a: user.pick.angle,
            s: user.pick.speed,
            i: user.pick.imageUrl,
            is: user.pick.sprite,
            isw: user.pick.spriteSize.width,
            ish: user.pick.spriteSize.height,
            mr: user.pick.moveRatio,
            snd: user.soundsToPlay || [],
        };
    },

    /**
     *
     * @param {Object} serializedUser
     *
     * @returns {{pick: {x, y, radius: number, angle: number, speed: number, imageUrl, sprite: string, moveRatio: number, spriteSize: {width: number, height: number}}, soundsToPlay: Array}}
     */
    deserializeUser: function (serializedUser) {
        return {
            pick: {
                x: serializedUser.x,
                y: serializedUser.y,
                radius: serializedUser.r,
                angle: serializedUser.a,
                speed: serializedUser.s,
                imageUrl: serializedUser.i,
                sprite: serializedUser.is,
                moveRatio: serializedUser.mr,
                spriteSize: {
                    width: serializedUser.isw,
                    height: serializedUser.ish,
                },
            },
            soundsToPlay: serializedUser.snd || [],
        };
    },

    /**
     * These data are sent when the user registers to the game.
     * This is the websocket response.
     *
     * @param {GameUserModel} user
     *
     * @returns {{l: ({n, i, s}), u: ({x: number, y: number, r: number, a: number, s: number, i: string, is: Array, isw: number, ish: number, mr: number, snd: Array})}}
     */
    serializeOnRegistration: function (user) {
        return {
            l: this.serializeLevel(user.level),
            u: this.serializeUser(user),
        };
    },

    /**
     * @param {LevelModel} level
     *
     * @returns {{n: (Array), i: (Game.data.level.images), s: (Game.data.level.sounds)}}
     */
    serializeLevel: function(level) {
        return {
            nm: level.data.name,
            w: level.data.mapWidth,
            h: level.data.mapHeight,
            n: this.serializeNotesArray(level.data.notes),
            i: level.images,
            s: level.sounds,
        }
    },

    /**
     * @param {Object} serializedLevel
     *
     * @returns {{data: {notes: (*|Array|n)}, images, sounds: (number|*|s)}}
     */
    deserializeLevel: function(serializedLevel) {
        return {
            data: {
                name: serializedLevel.nm,
                notes: serializedLevel.n, // TODO: deserialize notes
                mapWidth: serializedLevel.w,
                mapHeight: serializedLevel.h,
            },
            images: serializedLevel.i,
            sounds: serializedLevel.s,
        }
    },

    /**
     * @param {Array} notes
     * @returns {Array}
     */
    serializeNotesArray: function(notes) {
        let serializedNotes = [];

        for (let i = 0, l = notes.length; i < l; i++) {
            /**
             * @type {GameNoteModel} gameNote
             */
            let gameNote = notes[i];
            serializedNotes.push(this.serializeGameNote(gameNote));
        }

        return serializedNotes;
    },

    /**
     * @param {GameNoteModel} gameNote
     *
     * @returns {{x, y, d: number, s, ss: {w: (number), h: (number)}, sdp: {x: number, y: number}, sap: {x: number, y: number}}}
     */
    serializeGameNote: function(gameNote) {
        return {
            x: gameNote.x,
            y: gameNote.y,
            r: gameNote.radius,
            d: gameNote.soundDelay || 0,
            s: gameNote.note.sprite,
            ss: {
                w: gameNote.note.spriteSize.width,
                h: gameNote.note.spriteSize.height
            },
            sdp: {
                x: gameNote.note.spriteDefaultPosition.x,
                y: gameNote.note.spriteDefaultPosition.y,
            },
            sap: {
                x: gameNote.note.spriteActivePosition.x,
                y: gameNote.note.spriteActivePosition.y,
            },
        };
    }
};

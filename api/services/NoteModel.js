
let notes = {

    '0Sol#': {
        sound: '/sounds/68447__pinkyfinger__piano-g.wav',
        sprite: '/images/picks/colors.png',
        spriteSize: {
            width: 64,
            height: 64,
        },
        spriteDefaultPosition: {
            x: 0,
            y: 0,
        },
        spriteActivePosition: {
            x: 0,
            y: 0,
        }
    },

    '1La':   {
        sound: '/sounds/68437__pinkyfinger__piano-a.wav',
        sprite: '/images/picks/colors.png',
        spriteSize: {
            width: 64,
            height: 64,
        },
        spriteDefaultPosition: {
            x: 0,
            y: 0,
        },
        spriteActivePosition: {
            x: 64,
            y: 0,
        }
    },

    '1Sib':  {
        sound: '/sounds/68439__pinkyfinger__piano-bb.wav',
        sprite: '/images/picks/colors.png',
        spriteSize: {
            width: 64,
            height: 64,
        },
        spriteDefaultPosition: {
            x: 0,
            y: 0,
        },
        spriteActivePosition: {
            x: 0,
            y: 0,
        }
    },

    '1Si':   {
        sound: '/sounds/68438__pinkyfinger__piano-b.wav',
        sprite: '/images/picks/colors.png',
        spriteSize: {
            width: 64,
            height: 64,
        },
        spriteDefaultPosition: {
            x: 0,
            y: 0,
        },
        spriteActivePosition: {
            x: 0,
            y: 0,
        }
    },

    '1Do':   {
        sound: '/sounds/68441__pinkyfinger__piano-c.wav',
        sprite: '/images/picks/colors.png',
        spriteSize: {
            width: 64,
            height: 64,
        },
        spriteDefaultPosition: {
            x: 0,
            y: 0,
        },
        spriteActivePosition: {
            x: 0,
            y: 0,
        }
    },

    '1Re#':  {
        sound: '/sounds/68440__pinkyfinger__piano-c.wav',
        sprite: '/images/picks/colors.png',
        spriteSize: {
            width: 64,
            height: 64,
        },
        spriteDefaultPosition: {
            x: 0,
            y: 0,
        },
        spriteActivePosition: {
            x: 0,
            y: 0,
        }
    },

    '1Re':   {
        sound: '/sounds/68442__pinkyfinger__piano-d.wav',
        sprite: '/images/picks/colors.png',
        spriteSize: {
            width: 64,
            height: 64,
        },
        spriteDefaultPosition: {
            x: 0,
            y: 0,
        },
        spriteActivePosition: {
            x: 0,
            y: 0,
        }
    },

    '1Mib':  {
        sound: '/sounds/68444__pinkyfinger__piano-eb.wav',
        sprite: '/images/picks/colors.png',
        spriteSize: {
            width: 64,
            height: 64,
        },
        spriteDefaultPosition: {
            x: 0,
            y: 0,
        },
        spriteActivePosition: {
            x: 0,
            y: 0,
        }
    },

    '1Mi':   {
        sound: '/sounds/68443__pinkyfinger__piano-e.wav',
        sprite: '/images/picks/colors.png',
        spriteSize: {
            width: 64,
            height: 64,
        },
        spriteDefaultPosition: {
            x: 0,
            y: 0,
        },
        spriteActivePosition: {
            x: 0,
            y: 0,
        }
    },

    '1Fab':  {
        sound: '/sounds/68446__pinkyfinger__piano-f.wav',
        sprite: '/images/picks/colors.png',
        spriteSize: {
            width: 64,
            height: 64,
        },
        spriteDefaultPosition: {
            x: 0,
            y: 0,
        },
        spriteActivePosition: {
            x: 0,
            y: 0,
        }
    },

    '1Fa':   {
        sound: '/sounds/68445__pinkyfinger__piano-f.wav',
        sprite: '/images/picks/colors.png',
        spriteSize: {
            width: 64,
            height: 64,
        },
        spriteDefaultPosition: {
            x: 0,
            y: 0,
        },
        spriteActivePosition: {
            x: 0,
            y: 0,
        }
    },

    '1Sol':  {
        sound: '/sounds/68448__pinkyfinger__piano-g.wav',
        sprite: '/images/picks/colors.png',
        spriteSize: {
            width: 64,
            height: 64,
        },
        spriteDefaultPosition: {
            x: 0,
            y: 0,
        },
        spriteActivePosition: {
            x: 0,
            y: 0,
        }
    },

};

/**
 * @constructor
 *
 * @param {string} parameters.sound
 * @param {string} parameters.sprite
 * @param {{width: Number, height: Number}} parameters.spriteSize
 * @param {{x: Number, y: Number}} parameters.spriteDefaultPosition
 * @param {{x: Number, y: Number}} parameters.spriteActivePosition
 *
 * @property {string} sound
 * @property {string} sprite
 * @property {{width: Number, height: Number}} spriteSize
 * @property {{x: Number, y: Number}} spriteDefaultPosition
 * @property {{x: Number, y: Number}} spriteActivePosition
 */
let Note = function(parameters) {
    this.sound = parameters.sound;
    this.sprite = parameters.sprite;
    this.spriteSize = parameters.spriteSize;
    this.spriteDefaultPosition = parameters.spriteDefaultPosition;
    this.spriteActivePosition = parameters.spriteActivePosition;
};

/**
 * @namespace NoteModel
 * @constructor
 *
 * @return {Note|boolean}
 */
module.exports = function(noteName) {
    if (notes[noteName] && notes[noteName].sound) {
        return new Note(notes[noteName]);
    }

    return false;
};

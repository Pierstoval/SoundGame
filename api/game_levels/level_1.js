let level = {
    mapWidth: 500,
    mapHeight: 500,
    notes:  [],
    images: [
        '/images/quaver.gif'
    ],
    sounds: {
        '0Sol#': '/sounds/68447__pinkyfinger__piano-g.wav',
        '1La':   '/sounds/68437__pinkyfinger__piano-a.wav',
        '1Sib':  '/sounds/68439__pinkyfinger__piano-bb.wav',
        '1Si':   '/sounds/68438__pinkyfinger__piano-b.wav',
        '1Do':   '/sounds/68441__pinkyfinger__piano-c.wav',
        '1Re#':  '/sounds/68440__pinkyfinger__piano-c.wav',
        '1Re':   '/sounds/68442__pinkyfinger__piano-d.wav',
        '1Mib':  '/sounds/68444__pinkyfinger__piano-eb.wav',
        '1Mi':   '/sounds/68443__pinkyfinger__piano-e.wav',
        '1Fab':  '/sounds/68446__pinkyfinger__piano-f.wav',
        '1Fa':   '/sounds/68445__pinkyfinger__piano-f.wav',
        '1Sol':  '/sounds/68448__pinkyfinger__piano-g.wav',
    },
};

level.notes.push(new Models.Note(50 + 50, 250, '/images/quaver.gif', 10, 20, new Models.SoundEvent('1Do')));
level.notes.push(new Models.Note(75 + 50, 250, '/images/quaver.gif', 10, 20, new Models.SoundEvent('1Do')));
level.notes.push(new Models.Note(100 + 50, 250, '/images/quaver.gif', 10, 20, new Models.SoundEvent('1Do')));
level.notes.push(new Models.Note(125 + 50, 250, '/images/quaver.gif', 10, 20, new Models.SoundEvent('1Re')));
level.notes.push(new Models.Note(150 + 50, 250, '/images/quaver.gif', 10, 20, new Models.SoundEvent('1Mi')));
level.notes.push(new Models.Note(200 + 50, 250, '/images/quaver.gif', 10, 20, new Models.SoundEvent('1Re')));
level.notes.push(new Models.Note(250 + 50, 250, '/images/quaver.gif', 10, 20, new Models.SoundEvent('1Do')));
level.notes.push(new Models.Note(275 + 50, 250, '/images/quaver.gif', 10, 20, new Models.SoundEvent('1Mi')));
level.notes.push(new Models.Note(300 + 50, 250, '/images/quaver.gif', 10, 20, new Models.SoundEvent('1Re')));
level.notes.push(new Models.Note(325 + 50, 250, '/images/quaver.gif', 10, 20, new Models.SoundEvent('1Re')));
level.notes.push(new Models.Note(350 + 50, 250, '/images/quaver.gif', 10, 20, new Models.SoundEvent('1Do')));

module.exports = level;

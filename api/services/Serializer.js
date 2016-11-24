module.exports = {
    /**
     * This corresponds to the data sent to the client.
     * Serialization this way is good to have the less possible amount of data.
     *
     * @param user
     */
    serializeDataFromUser: function (user) {
        return {
            x: user.pick.x,
            y: user.pick.y,
            r: user.pick.radius,
            a: user.pick.angle,
            s: user.pick.speed,
            i: user.pick.imageUrl,
            n: this.serializeNotesArray(user.level.notes),
            snd: user.playSounds,
        };
    },

    serializeNotesArray: function(notes) {
        var serializedNotes = [];

        for (var i = 0, l = notes.length; i < l; i++) {
            let note = notes[i];
            serializedNotes.push({
                x: note.x,
                y: note.y,
                i: note.imageUrl,
            });
        }

        return serializedNotes;
    },
};

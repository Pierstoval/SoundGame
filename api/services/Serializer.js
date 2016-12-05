/**
 * @namespace Serializer
 */
module.exports = {
    /**
     * This corresponds to the data sent to the client.
     * Serialization this way is good to have the less possible amount of data.
     *
     * @param user
     * @this Serializer
     */
    serializeDataFromUser: function (user) {
        return {
            x: user.pick.x,
            y: user.pick.y,
            r: user.pick.radius,
            a: user.pick.angle,
            s: user.pick.speed,
            i: user.pick.imageUrl,
            mr: user.pick.moveRatio,
            snd: user.soundsToPlay,
            nt: SocketLooper.numberOfTicks
        };
    },

    /**
     * These data are sent when the user registers to the game.
     * This is the websocket response.
     *
     * @param user
     * @this Serializer
     */
    serializeWorldFromUser: function (user) {
        return {
            ln: user.level.name,
            w: user.level.mapWidth,
            h: user.level.mapHeight,
            i: user.level.images,
            s: user.level.sounds,
            n: this.serializeNotesArray(user.level.notes),
        };
    },

    serializeNotesArray: function(notes) {
        let serializedNotes = [];

        for (let i = 0, l = notes.length; i < l; i++) {
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

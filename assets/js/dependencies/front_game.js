"use strict";

(function(w, d){
    var username = w.localStorage.getItem('username');

    // Validate username.
    if (!username) {
        do {
            if (username) {
                username = prompt('Le nom doit être composé uniquement de caractères alphanumériques.');
            } else {
                username = prompt('Nom');
            }
        } while (!username.toLowerCase().trim().match(/^[a-z0-9_-]+$/gi));
        // w.localStorage.setItem('username', username);
    }

    // Use .get() to contact the server
    io.socket.post('/game/create', {name: username}, function gotResponse(body, response) {
        // Handle wrong response.
        if (200 !== response.statusCode) {
            console.log('Server responded with status code ' + response.statusCode + ' and data: ', body);

            d.getElementById('content').innerHTML +=
                'Server responded with status code '
                + response.statusCode
                + ' and data: '
                + JSON.stringify(body, undefined, 4);

            return;
        }

        io.socket.on('hello', function gotHelloMessage (data) {
            console.log('Hello!', data);
        });
    });

})(window, window.document);

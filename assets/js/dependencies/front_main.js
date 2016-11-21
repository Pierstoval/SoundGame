(function(w, d, io){

    /*
    io.socket.post('/s/register_home', {}, function(body, response) {
        if (200 !== response.statusCode) {
            console.log('Server responded with status code ' + response.statusCode + ' and data: ', body);

            d.getElementById('content').innerHTML +=
                'Failed to register to home socket.<br>'
                + 'Server responded with status code '
                + response.statusCode
                + ' and data:'
                + '<pre>'
                + JSON.stringify({body: body, response: response}, null, 4)
                + '</pre>';

            return;
        }

        d.getElementById('content').innerHTML +=
            'Response OK! :D.<br>'
            + 'Server responded with status code '
            + response.statusCode
            + ' and data:'
            + '<pre>'
            + JSON.stringify({body: body, response: response}, null, 4)
            + '</pre>';


        io.socket.on('home', console.info);
        io.socket.on('hello', console.info);
    });
    */

})(window, window.document, io);

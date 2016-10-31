
// Event received from the server
io.socket.on('hello', function gotHelloMessage (data) {
    console.log('Hello!', data);
});

// Use .get() to contact the server
io.socket.get('/game/start', function gotResponse(body, response) {
    console.log('Server responded with status code ' + response.statusCode + ' and data: ', body);
});

var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');

    // socket.emit('createMessage', {  // emitting to server
    //     from: 'Andrew',
    //     text: 'Yup, that works for me.'
    // });
});

socket.on('disconnect',function () {
    console.log('Disconnected from server');
});
//-- log this to the screen i.e. chrome dev tool console, listening to server emit event
socket.on('newMessage', function(message) {
    console.log('newMessage', message);  
});
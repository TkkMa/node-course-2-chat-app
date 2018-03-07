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
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    
    jQuery('#messages').append(li);
});

// Callback to fire when it receives acknowledgement from the server
// socket.emit('createMessage', {
//     from: 'Frank',
//     text: 'hi'
// }, function(data){
//     console.log('Got it', data);
// });

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();  // prevents default action i.e. refresh page

    socket.emit('createMessage',{
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function(){

    });
});
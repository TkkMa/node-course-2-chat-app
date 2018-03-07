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
socket.on('newLocationMessage', function(message){
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>');  //_blank opens up a tab to view google maps

    li.text(`${message.from}: `);
    a.attr('href', message.url)
    li.append(a);
    jQuery('#messages').append(li);
})

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();  // prevents default action i.e. refresh page

    socket.emit('createMessage',{
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function(){

    });
});

// Set up click listener for location button
var locationButton = jQuery('#send-location');
locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }
    // fetch location -- if succeeds, emit event; if fails, alert the user
    // getCurrentPosition takes two arguments, success and failure
    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function(){
        alert('Unable to fetch location.');
    });
});
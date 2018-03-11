var socket = io();

function scrollToBottom(){
    //selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');  //just added message height
    //Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    // console.log(`clientHeight: ${clientHeight}  scrollTop: ${scrollTop}`);
    // console.log(`newMessageHeight: ${newMessageHeight}  lastMessageHeight: ${lastMessageHeight}`);
    // console.log(`scrollHeight: ${scrollHeight}`);
    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        //console.log('Should scroll')
        messages.scrollTop(scrollHeight); // set scrollTop to scrollHeight i.e. go to the button
    }
}
socket.on('connect', function () {
    console.log('Connected to server');
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function(err){
        if (err){
            alert(err);
            window.location.href = '/';  // forwards user to the main page
        } else{
            console.log('No error');
        }
    });
});

socket.on('disconnect',function () {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function(users){
    console.log('Users list', users);  // users Array
    var ol = jQuery('<ol></ol>');
    users.forEach(function(userName) {
        ol.append(jQuery('<li></li>').text(userName));
    });

    jQuery('#users').html(ol);
});
//-- log this to the screen i.e. chrome dev tool console, listening to server emit event
socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template,{
        text:message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
    // console.log('newMessage', message);
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    
    // jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template,{
        from: message.from,
        createdAt: formattedTime,
        url: message.url
    });

    jQuery('#messages').append(html);
    scrollToBottom();
})

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();  // prevents default action i.e. refresh page

    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage',{
        from: 'User',
        text: messageTextbox.val()
    }, function(){
        messageTextbox.val('')
    });
});

// Set up click listener for location button
var locationButton = jQuery('#send-location');
locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');
    // fetch location -- if succeeds, emit event; if fails, alert the user
    // getCurrentPosition takes two arguments, success and failure
    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function(){
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location.');
    });
});
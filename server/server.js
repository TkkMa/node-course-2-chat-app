const path = require('path');
const http = require('http');
const express = require('express');
const publicPath = path.join(__dirname, '../public');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
// console.log(__dirname + '/../public');
// console.log(publicPath);
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) =>{
    console.log('New user connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));  // emitting from server -> client

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined')); // socket.emit emits event to a single connection

    socket.on('createMessage', (message, callback) =>{  // listen to event sent from client
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text))   // emits to every single event
        callback();
    });
    
    socket.on('createLocationMessage', (coords) =>{
    //    io.emit('newMessage', generateMessage('Admin', `${coords.latitude}, ${coords.longitude}`));
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', (socket) =>{
        console.log('Client disconnected');
    });
});
server.listen(port, (req, res)=>{
    console.log(`Server is up on port ${port}`);
})

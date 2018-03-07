const path = require('path');
const http = require('http');
const express = require('express');
const publicPath = path.join(__dirname, '../public');
const socketIO = require('socket.io');
//const {generateMessage} = require('./utils/message');
// console.log(__dirname + '/../public');
// console.log(publicPath);
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) =>{
    console.log('New user connected');

    // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));  // emitting from server -> client

    // socket.emit('newMessage', generateMessage('Admin', 'New user joined')); // socket.emit emits event to a single connection
    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to the chat app',
        createdAt: new Date().getTime()
    });
    socket.broadcast.emit('newMessage',{
        from: 'Admin',
        text: 'New user joined',
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', (message) =>{  // listen to event sent from client
        console.log('createMessage', message);
        io.emit('newMessage', {   // emits to every single event
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
        // socket.broadcast.emit('newMessage',{
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })
    });
    
    socket.on('disconnect', (socket) =>{
        console.log('Client disconnected');
    });
});
server.listen(port, (req, res)=>{
    console.log(`Server is up on port ${port}`);
})

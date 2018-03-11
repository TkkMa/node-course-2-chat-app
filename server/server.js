const path = require('path');
const http = require('http');
const express = require('express');
const publicPath = path.join(__dirname, '../public');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

// console.log(__dirname + '/../public');
// console.log(publicPath);
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) =>{
    console.log('New user connected');

    socket.on('join', (params, callback) =>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room name are required.')
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        // socket.leave(params);

        // io.emit -- emits to everybody in user -> io.to('The Office Fans').emit
        // socket.broadcast.emit -- emits to everybody except the current user
        // socket.emit -- emits to specific one user
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));  // emitting from server -> client
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`)); // socket.emit emits event to a single connection
        callback();
    })

    socket.on('createMessage', (message, callback) =>{  // listen to event sent from client
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text))   // emits to every single event
        callback();
    });
    
    socket.on('createLocationMessage', (coords) =>{
    //    io.emit('newMessage', generateMessage('Admin', `${coords.latitude}, ${coords.longitude}`));
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () =>{
        console.log('Client disconnected');
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    });
});
server.listen(port, (req, res)=>{
    console.log(`Server is up on port ${port}`);
})

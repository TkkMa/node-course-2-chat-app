const path = require('path');
const http = require('http');
const express = require('express');
const publicPath = path.join(__dirname, '../public');
const socketIO = require('socket.io');

// console.log(__dirname + '/../public');
// console.log(publicPath);
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) =>{
    console.log('New user connected');

    socket.on('disconnect', (socket) =>{
        console.log('Client disconnected');
    })
});
server.listen(port, (req, res)=>{
    console.log(`Server is up on port ${port}`);
})

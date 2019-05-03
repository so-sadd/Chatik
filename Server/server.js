const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const os = require('os');
const cors = require('cors');

http.listen(1919, function () {
    console.log('Server run on port: 1919');
});

var connectedUsers = {};

io.on('connection', (socket) => {

    console.log('User connected: ' + socket.id)
    //connectedUsers.push({ data: socket.id });
    //socket.emit('connections', Object.keys(io.sockets.connected).length);

    socket.on('disconnect', () => {
        console.log("User disconnected" + socket.id);
        //delete connectedUsers[data];
    });

    socket.on('chat-message', (data) => {
        socket.broadcast.emit('chat-message', (data));
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', (data));
    });

    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping');
    });

    socket.on('joined', function (nickname) {
        socket.broadcast.emit('joined', (nickname));
        connectedUsers[nickname] = socket.id;
    });

    socket.on('leave', function (nickname) {
        socket.broadcast.emit('leave', (nickname));
        delete connectedUsers[nickname];
    });
});

app.use(cors());
app.get('/UserName', (req, res) => res.send(os.userInfo().username));
app.get('/ConnectedUsers', (req, res) => res.send(connectedUsers));
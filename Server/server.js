const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const os = require('os');
const cors = require('cors');

http.listen(1919, function () {
    console.log('Server run on port: 1919');
});

let connectedUsers = {};

io.on('connection', OnConnect);

function OnConnect(socket) {

    console.log('Connected: ' + socket.id)

    socket.on('disconnect', () => {
        console.log("Disconnected:" + socket.id);
        delete connectedUsers[socket.id];
    });

    // socket.on('chat-message', (data) => {
    //     socket.broadcast.emit('chat-message', (data));
    // });

    // socket.on('typing', (data) => {
    //     socket.broadcast.emit('typing', (data));
    // });

    // socket.on('stopTyping', () => {
    //     socket.broadcast.emit('stopTyping');
    // });

    socket.on('joined', function (user_name) {
        // socket.broadcast.emit('joined', { id: name });
        connectedUsers[socket.id] = user_name;
        console.log('Joined:' + user_name);
    });

    socket.on('leave', function (user_id) {
        // socket.broadcast.emit('leave', userid);
        delete connectedUsers[user_id];
        console.log('Leaved:' + user_id);
    });

    socket.on('getCounter', function (callback) {
        callback(connectedUsers);
    });
};

app.use(cors());
app.get('/UserName', (req, res) => res.send(os.userInfo().username));
app.get('/ConnectedUsers', (req, res) => res.send(connectedUsers));
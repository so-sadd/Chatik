const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const os = require('os'); //

http.listen(1919, function () {
    console.log('Server run on port: 1919');
});

let connectedUsers = {};

io.on('connection', function (socket) {

    console.log('Connected: ' + socket.id)

    socket.on('disconnect', () => {
        console.log("Disconnected:" + socket.id);
        delete connectedUsers[socket.id];
    });

    socket.on('message', function (data) {

        let id = Object.keys(connectedUsers).find(key => connectedUsers[key] === data.reciever);

        io.to(id).emit('message', data);

        //send to all
        //socket.broadcast.emit('message', (data));
    });

    // socket.on('typing', (data) => {
    //     socket.broadcast.emit('typing', (data));
    // });

    // socket.on('stop-typing', () => {
    //     socket.broadcast.emit('stopTyping');
    // });

    socket.on('joined', function (user_name) {
        socket.broadcast.emit('joined', { id: socket.id, name: user_name });
        connectedUsers[socket.id] = user_name;
        console.log('Joined:' + user_name);
    });

    socket.on('leave', function (user_id) {
        socket.broadcast.emit('leave', user_id);
        delete connectedUsers[user_id];
        console.log('Leaved:' + user_id);
    });

    socket.on('connected-users', function (callback) {
        callback(connectedUsers);
    });

    socket.on('os-user-name', function (callback) {
        callback(os.userInfo().username);
    });
});
var express = require('express');
var app = express();
var router = require('./router/main')(app);
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

io.sockets.on('connection', function(socket) {
  console.log('user connected: ', socket.id);

  socket.on('username', function(username) {
      socket.username = username;
      var clientIpAddress = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
      io.emit('is_online', socket.username + '(' + clientIpAddress+ ') is connected...');
      // TODO: send clint ip
      io.to(socket.id).emit('my_ip', clientIpAddress);
    });

  socket.on('disconnect', function(username) {
      io.emit('is_offline', socket.username + '(' + socket.handshake.address+ ') is disconnected...');
      console.log('user disconnected: ' + socket.id + '(' + socket.username + ')');
  })

  socket.on('chat_message', function(message) {
    if(socket.username == undefined) { // if chat server is crushed & restarted
      io.to(socket.id).emit('username', 'tell me again...');
    } else {
      io.to(socket.id).emit('my_message', socket.username + '@' + socket.id + ':~#: ' + message);
      socket.broadcast.emit('chat_message', socket.username + '@' + socket.id + ':~#: ' + message);
    }
});
});

http.listen(3000, function(){
  console.log('server on *:3000');
});

app.use(express.static(__dirname + '/public'));
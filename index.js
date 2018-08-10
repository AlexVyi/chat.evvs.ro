const express = require('express')
const socket = require('socket.io')
//app setup
const app = express()
const server = app.listen(4000,function () {
   console.log('Server is listening on port 4000')
})
const users = [];
const connections = [];

app.use(express.static(__dirname + '/node_modules/jquery/dist'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/socket.io-client/dist'));
app.use(express.static('public'))


//socket setup
const io = socket(server)
io.sockets.on('connection',function (socket) {
  //connect and see how many connections
  connections.push(socket)
  console.log('Connected: %s sockets connected', socket.id, connections.length)

  //disconnect
  socket.on('disconnect',function (data) {
    users.splice(users.indexOf(socket.username), 1)
    updateUsers()
    connections.splice(connections.indexOf(socket), 1)
    console.log('Disconnected: %s sockets connected', socket.id, connections.length)
  });

  //new user
  socket.on('new user',function (data,callback) {
    callback(true);
    socket.username = data;
    users.push(socket.username)
    updateUsers()
  });
  //helper function to update the users in the chat
  function updateUsers(){
    io.sockets.emit('get users', users)
  }

  //send the actual message
  socket.on('send message',function (data) {
    io.sockets.emit('new message',{msg:data, user:socket.username})
  });

  //show the users whose typing
  socket.on('typing', function (data) {
    socket.broadcast.emit('typing', {user:socket.username})
  })
})
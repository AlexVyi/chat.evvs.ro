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
var nsp = io.of('/chat');  //we define a namespace and instead of io.sockets.on,  which defaults to '/' as in localhost:4000, we write nsp.on and we get '/chat as in localhost:4000/chat,
nsp.on('connection',function (socket) {
  //connect and see how many connections
  connections.push(socket)
  console.log('Connected: %s sockets connected, ', connections.length, 'socket id: ' , socket.id)

  //disconnect
  socket.on('disconnect',function (data) {

         users.splice(users.indexOf(socket.username), 1)
         updateUsers()
         connections.splice(connections.indexOf(socket), 1)
         console.log('Disconnected: %s sockets remained connected', connections.length)

  });


  //new user
  socket.on('new user',function (data,callback) {

    socket.username = {// make a js object and store in it the id and the name of the user
      userId : socket.id,
      username: data.username
    }
    if(data.username === ""){
      callback(false);
    }else {
      callback(true);
      users.push(socket.username)
      updateUsers()
    }
  });
  //helper function to update the users in the chat
  function updateUsers(){
    nsp.emit('get users', users)
  }

  //send the actual message to the whole list of users
  socket.on('send message',function (data) {//instead of io.sockets.emit, who defaults to '/' as in localhost:4000, we write nsp.on. and we get '/chat as in localhost:4000/chat
    nsp.emit('new message',{msg:data, user:socket.username})//assign to user both id and name, and emit the message to everyone including you
  });//socket.broadcast.emit ----assign to user both id and name and emit the message to everyone except you you


  //show the users whose typing
  socket.on('typing', function (data) {
    socket.broadcast.emit('typing', {user:socket.username})
  })
})



/*send the actual message to a specific user
socket.on( 'sendToUser', function( msg, userId ){
  // try and get the socket from our connected list
  const otherSocket = io.sockets.connected[userId]; // NOTE: sockets is the default "/" namespace
  if( otherSocket )
    otherSocket.emit( 'messageFromUser',
      { msg:data,
        userId: socket.username.userId
      });
  console.log(otherSocket)
});*/

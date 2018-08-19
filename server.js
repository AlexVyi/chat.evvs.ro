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
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/css'));
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
         socket.disconnect()
          if(socket.username === undefined){//on disconnect we don't have access to socket.username, so if we use directly socket.username.username, we crash the server
            connections.splice(connections.indexOf(socket), 1)
            console.log('Disconnected: %s sockets remained connected', connections.length)
            return  socket.disconnect()
          }else {
            connections.splice(connections.indexOf(socket), 1)
            console.log('Disconnected: %s sockets remained connected', connections.length)
            users.splice(users.indexOf(socket.username),1)
            updateUsers()
            console.log(users)
          }


  });


  //new user
  socket.on('new user',function (data,callback) {
    //console.log(users)
     for(let i = 0;i<users.length;i++){
      if(users[i].username === data.username){
        return callback(false)
      }
    }

    socket.username = {// make a js object and store in it the id and the name of the user
      userId : socket.id,
      username: data.username
    };
    if(data.username === ""){
      return callback(false);
    }else {
      callback(true);
      users.push(socket.username)
      updateUsers()
      console.log(users)

    }
  });
  //helper function to update the users in the chat
  function updateUsers(){
    nsp.emit('get users', users)
  }

  //send the actual message to the whole list of users
  socket.on('send message',function (data) {//instead of io.sockets.emit, who defaults to '/' as in localhost:4000, we write nsp.on. and we get '/chat as in localhost:4000/chat
    new_message = {
      msg:{time: new Date().getTime(), data},
      user:socket.username
    };
    nsp.emit('new_message',new_message)//assign to user both id and name, and emit the message to everyone including you
    //console.log(new_message)
  });//socket.broadcast.emit ----assign to user both id and name and emit the message to everyone except you you


  //show the users which one is typing
  socket.on('typing', function (data) {
    socket.broadcast.emit('typing', {user:socket.username})
  })


  /*socket.on( 'sendToUser', function( msg, userId ){
    socket.to( userId ).emit( 'messageFromUser', msg, socket.id );
  });*/


})//nsp connection



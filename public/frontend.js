// Make connection
const socket = io.connect('/chat',{ forceNew: true },console.log('connected'))


// Query DOM
let message = document.getElementById('message'),
  name = document.getElementById('name'),
  btn = document.getElementById('send'),
  loginBtn = document.getElementById('loginButton'),
  chat = document.getElementById('chat-window'),
  feedback = document.getElementById('feedback'),
  key_up = document.getElementById('key_up'),
  disconnectBtn = document.getElementById('disconnect'),
  chat_container = document.getElementById('chat_container'),
  userFormArea = document.getElementById('userFormArea'),
  users = document.getElementById('users'),
  username = document.getElementById('username')


// update the users list on the client and login
socket.on('get users',function (data) {
  let html = ''
  for(let i = 0;i < data.length; i++){
    html += '<li class="list-group-item">' + data[i].username + '</li>'
  }

  users.innerHTML = html
});

//login
loginBtn.addEventListener('click', function(event){
  event.preventDefault()
  socket.emit('new user', {username: username.value},function (data) {
     if (data){
       userFormArea.style.display = "none";
         chat_container.style.display = "flex"

     }
  });
  username.value = "";//after login clear the input
});


socket.on('disconnect', function (data) {
    userFormArea.style.display = "flex";
    chat_container.style.display = "none"
    socket.disconnect()
    console.log('disconnected')
    socket.open();
});

disconnectBtn.addEventListener('click', function(event){
  event.preventDefault()
        socket.emit('disconnect')
})

//front end new chat messages
socket.on('new message', function(data){

  msg = Object.values(data.msg )
  user = Object.values(data.user)
  let username = '';
  for(let i = 0;i<user.length;i++) {
    username = user[i];
  }


  feedback.innerHTML = ""//set the typing event to an empty string after the new message is displayed

  chat.innerHTML += '<p><strong style="background-color: #575ed8">' + username + ': </strong>' + msg + '</p>';
});

// Emit the message to all users in the list
btn.addEventListener('click', function(event){
  event.preventDefault();
  if(username) {
      socket.emit('send message', {
      message: message.value,
    });
  }
  message.value = "";
});

//emit the same message from enter key
key_up.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    socket.emit('send message', {
      message: message.value,
    });
    message.value = "";
  }
});



// bring the typing event from the back to front
message.addEventListener('keypress', function(){
  socket.emit('typing', );
})

//show whose typing to the client
socket.on('typing', function(data){
  user = Object.values(data.user )
  let username = '';
  for(let i = 0;i<user.length;i++) {
    username = user[i];

  }
  feedback.innerHTML = '<p><em>' + username + ' is typing a message...</em></p>';
});



/*emit the private message
socket.on( 'sendToUser', function( msg, userId ){
  socket.to( userId ).emit( 'messageFromUser',
    { msg:data,
    userId: socket.username.userId
  });
  console.log(userId)
});*/

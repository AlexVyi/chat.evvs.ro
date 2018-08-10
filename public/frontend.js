// Make connection
const socket = io.connect();

// Query DOM
let message = document.getElementById('message'),
  name = document.getElementById('name'),
  btn = document.getElementById('send'),
  loginBtn = document.getElementById('loginButton'),
  chat = document.getElementById('chat-window'),
  feedback = document.getElementById('feedback'),
  key_up = document.getElementById('key_up'),
  //userForm = document.getElementById('userForm'),
  chat_container = document.getElementById('chat_container'),
  userFormArea = document.getElementById('userFormArea'),
  users = document.getElementById('users'),
  username = document.getElementById('username')

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

// update the users list on the client
socket.on('get users',function (data) {
     let html = ''
     for(let i = 0;i < data.length; i++){
         html += '<li class="list-group-item">' + data[i].username + '</li>'
     }

     users.innerHTML = html
});
// Emit the message
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

//front end new chat messages
socket.on('new message', function(data){
  msg = Object.values(data.msg )
  user = Object.values(data.user )

  feedback.innerHTML = ""//set the typing event to an empty string after the new message is displayed

  chat.innerHTML += '<p><strong>' + user + ': </strong>' + msg + '</p>';
});

// bring the typing event from the back to front
message.addEventListener('keypress', function(){
  socket.emit('typing', );
})

//show whose typing to the client
socket.on('typing', function(data){

  user = Object.values(data.user )
  feedback.innerHTML = '<p><em>' + user + ' is typing a message...</em></p>';
});
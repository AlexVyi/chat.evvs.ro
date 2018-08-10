// Make connection
const socket = io.connect();

// Query DOM
let message = document.getElementById('message'),
  handle = document.getElementById('name'),
  btn = document.getElementById('send'),
  loginBtn = document.getElementById('loginButton'),
  output = document.getElementById('output'),
  feedback = document.getElementById('feedback'),
  keyup = document.getElementById('keyup'),
  //userForm = document.getElementById('userForm'),
  messageArea = document.getElementsByClassName('messageArea'),
  userFormArea = document.getElementById('userFormArea'),
  users = document.getElementById('users'),
  username = document.getElementById('username')

//login
loginBtn.addEventListener('click', function(event){
  event.preventDefault()
  socket.emit('new user', {username: username.value},function (data) {
     if (data){
       userFormArea.style.display = "none";
       for(let i = 0;i < messageArea.length;i++){
         messageArea[i].style.display = "block"
       }
     }
  });
  username.value = "";
});

// update the users list on the client
socket.on('get users',function (data) {
     let html = ''
     let placeholder = ''
     for(let i = 0;i < data.length; i++){
         html += '<li class="list-group-item">' + data[i].username + '</li>'
         placeholder += data[i].username
       }

     users.innerHTML = html
     handle.setAttribute('placeholder', placeholder)
});
// Emit events from the button
btn.addEventListener('click', function(){
  if(username) {
      socket.emit('send message', {
      message: message.value,
      handle: handle.placeholder
    });
  }
  message.value = "";
});

//emit the same event from enter key
keyup.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    socket.emit('send message', {
      message: message.value,
      handle: handle.placeholder
    });
    message.value = "";
  }
});
// bring the typing event from the back to front
message.addEventListener('keypress', function(){
  socket.emit('typing', handle.placeholder);
})


//front end new chat messages
socket.on('new message', function(data){
  feedback.innerHTML = ""
  output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});
//show whose typing to the client
socket.on('typing', function(data){
  feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
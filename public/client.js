// Make connection
const socket = io.connect('/chat',console.log('connected'))


// Query DOM
let message = document.getElementById('message'),
  errorDiv = document.getElementById('error'),
  btn = document.getElementById('send'),
  loginBtn = document.getElementById('loginButton'),
  chat = document.getElementById('chat-window'),
  incoming = document.getElementById('received_width_msg'),
  outgoing = document.getElementById('sent_msg'),
  feedback = document.getElementById('feedback'),
  key_up = document.getElementById('key_up'),
  disconnectBtn = document.getElementById('disconnect'),
  chat_container = document.getElementById('chat_container'),
  userFormArea = document.getElementById('userFormArea'),
  users = document.getElementById('users'),
  username = document.getElementById('username'),
  music = document.getElementById('play_sound'),
  list_item_current_user = document.getElementById('current_user'),
  currentUser


disconnectBtn.addEventListener('click', function(event){
  event.preventDefault()
  socket.emit('disconnect')
})

socket.on('disconnect', function (data) {
  userFormArea.style.display = "flex";
  chat_container.style.display = "none"
  chat.innerHTML = null
  socket.disconnect()
  //localStorage.clear()
  console.log('disconnected')
  socket.open();

});


// update the users list on the client and login
socket.on('get users',function (data) {
  let html = '';
    for (let i = 0; i < data.length; i++) {
      let current_user = data[i].userId
        //localStorage.setItem('users', JSON.stringify(data));
      //begin notifications
      let Notification = window.Notification || window.mozNotification || window.webkitNotification;

      if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
      }
      // Let's check whether notification permissions have already been granted
      else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        let notification = new Notification("Hi there!" + data[i].username + " " + "just connected");
      }
      // Otherwise, we need to ask the user for permission
      else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
          // If the user accepts, let's create a notification
          if (permission === "granted") {
            let notification = new Notification("Hi there!" + data[i].username + " " + "just connected");
          }
        });
      }
      //end notification

        html += '<li class="list-group-item" id="current_user">' + data[i].username + '</li>'

    }
  users.innerHTML = html

});

//login
loginBtn.addEventListener('click', function(event){
  event.preventDefault()
  var sound_file = "sound/CALC.WAV"
  socket.emit('new user', {username: username.value},function (data) {
     if(data){
       music.innerHTML= "<source type=\"audio/wav\" src=\""+sound_file+"\" hidden=\"true\" autostart=\"true\" loop=\"false\" />";
       userFormArea.style.display = "none";
       chat_container.style.display = "flex";
     }
     else{
       errorDiv.innerHTML = "Username exists or blank form submitted"
     }
  });

  currentUser = username.value
  username.value = "";//after login clear the input
});


//front end new chat messages
socket.on('new message', function(data){

  msg = Object.values(data.msg )
  user = Object.values(data.user)
  let username = '';
  for(let i = 0;i<user.length;i++) {
    username = user[i]
    if(username === currentUser){
      data.outgoingClass = "outgoingText";

    } else{
      data.incomingClass = "incomingText";

    }
  }

  feedback.innerHTML = ""//set the typing event to an empty string after the new message is displayed
  if(data.outgoingClass === 'outgoingText') {
    outgoing.innerHTML += '<p id="outgoingParagraph"><strong class="' + data.outgoingClass + '">' + username + ': </strong>' + msg + '</p>';
  }else{
    incoming.innerHTML += '<p id="incomingParagraph"><strong class="' + data.incomingClass + '">' + username + ': </strong>' + msg + '</p>';

  }

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
socket.on('typing', function(data){
  user = Object.values(data.user )
  let username = '';
  for(let i = 0;i<user.length;i++) {
    username = user[i];

  }
  feedback.innerHTML = '<p><em>' + username + ' is typing a message...</em></p>';
});


//emit the typing event to the client
message.addEventListener('keypress', function(){
  socket.emit('typing', );
})



/*socket.on( 'sendToUser', function( msg, userId ){
  socket.to( userId ).emit( 'messageFromUser',
    { msg:data,
    userId: socket.username.userId
  });
  console.log(userId)
});*/

/*else if(localStorage){
       userFormArea.style.display = "none";
       chat_container.style.display = "flex";
       let html = '';
       var users = JSON.parse(localStorage.getItem('users'));
       for (let i = 0; i < users.length; i++) {
         console.log(users[i].username)
         html += '<li class="list-group-item">' + users[i].username + '</li>'
       }
       users.innerHTML = html
     }*/

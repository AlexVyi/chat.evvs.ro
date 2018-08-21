 let incomingDIV = document.getElementById('incoming_msg'),
     outgoingDIV = document.getElementById('outgoing_msg');
function scrollChatContent() {
  if(incomingDIV) {
	  setInterval(function scrollToTop () {
		  document.getElementById('chat-window').scrollTop = document.getElementById('chat-window').scrollHeight;
	  }, 1000)
  }else {
	  setInterval(function scrollToTop () {
		  outgoingDIV.scrollTop = outgoingDIV.scrollHeight;
	  }, 1000)
  }
}


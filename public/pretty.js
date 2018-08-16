
function scrollChatContent() {
  setInterval(function scrollToTop () {
    document.getElementById('chat-window').scrollTop = document.getElementById('chat-window').scrollHeight;
  }, 1000)
}


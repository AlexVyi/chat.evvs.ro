  incoming = document.getElementById('received_width_msg'),
  outgoing = document.getElementById('sent_msg')
function scrollChatContent() { //not ok but it will do for now.it only scrolls the outgoing, if they are into view, and incoming if u scroll until they are into view
  if(incoming) {
    setInterval(function scrollToTop () {
      incoming.scrollTop = incoming.scrollHeight;
    }, 1000)
  }else{
    setInterval(function scrollToTop () {
      outgoing.scrollTop = outgoing.scrollHeight;
    }, 1000)
  }
}


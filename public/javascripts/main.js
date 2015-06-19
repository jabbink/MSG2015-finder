var socket = io();

socket.on('roomchange', function(msg){
  console.log(msg);
  console.log(msg.user.name +': '+ msg.roomID);
});
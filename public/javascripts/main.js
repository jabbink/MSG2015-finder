var socket = io();

socket.on('roomchange', function(msg) {
  $('#log').prepend('<div>['+ (new Date()).toLocaleTimeString() +'] - <span class="user">'+ msg.user.name +'</span> joined <span class="room">'+ msg.roomID +'</span></div>');
  console.log(msg.user.name +': '+ msg.roomID);
});

socket.on('usercount', function(msg) {
  $('#connections').text(msg.usercount);
});

socket.on('disconnect', function(){
  $('#status').text('reconnecting...');
});
socket.on('connect', function(){
  $('#status').text('connected');
});
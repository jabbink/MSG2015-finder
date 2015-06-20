var socket = io();

socket.on('roomchange', function(msg) {
  var date = undefined;
  if (msg.user.date) {
    date = new Date(msg.user.date);
  } else {
    date = new Date();
  }
  $('#log').prepend('<div>['+ date.toLocaleTimeString() +'] - <span class="user">'+ msg.user.name +'</span> joined <span class="room">'+ msg.user.room +'</span></div>');
  console.log(msg.user.name +': '+ msg.user.room);
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
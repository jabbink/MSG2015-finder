var socket = io();

var users = {};
var initialized = false;

var logUser = function(user) {
  var date = undefined;
  if (user.date) {
    date = new Date(user.date);
  } else {
    date = new Date();
  }
  $('#log').prepend('<div>['+ date.toLocaleTimeString() +'] - <span class="user">'+ user.name +'</span> joined <span class="room">'+ user.room +'</span></div>');
  console.log(user.name +': '+ user.room);
};

socket.on('roomchange', function(msg) {
  if (users[msg.user.accountid] == undefined || msg.user.room != users[msg.user.accountid].room) {
    users[msg.user.accountid] = msg.user;
    logUser(msg.user);
  }
});

socket.on('usercount', function(msg) {
  $('#connections').text(msg.usercount);
});

socket.on('disconnect', function() {
  $('#status').text('reconnecting...');
});
socket.on('connect', function() {
  if (!initialized) {
    initialized = true;
    socket.emit('ping');
  }
  $('#status').text('connected');
});
socket.on('pong', function(data) {
  users = data.users;
  var sortable = [];
  for (var user in users) {
    sortable.push([new Date(users[user].date), users[user]]);
  }

  sortable.sort(function(a, b) {
    return ( ( a[0] == b[0] ) ? 0 : ( ( a[0] > b[0] ) ? 1 : -1 ) )
  });

  for (var user in sortable) {
    logUser(sortable[user][1]);
  }
});
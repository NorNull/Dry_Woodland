var express = require ('express');
var app = express ();
var http = require ('http').createServer (app);
var io = require ('socket.io')(server);

app.set ('port', process.env.PORT || 3000);

server.listen (app.get ('port'), function () {
  console.log ("Server is running");
});

var user = [,]
var ai_room = [];

io.on ('connection', function (socket) {
  io.on ('Born', function (r_data) {
      user.forEach(function (index) {
        if (user [index] ['room'] == r_data ['room']) {
          var data = {user : user [index], cha : user [index] ['cha'],
                      pos : user [index] ['pos'], pos : user [index] ['rot']};

          socket.emit ('Born', data);
        }
      });

      user [r_data ['user'], 'socketId'] = socket.id;
      user [r_data ['user'], 'cha'] = r_data ['cha'];
      user [r_data ['user'], 'room'] = r_data ['room'];
      user [r_data ['user'], 'pos'] = r_data ['pos'];
      user [r_data ['user'], 'rot'] = r_data ['rot'];

      socket.join (r_data ['room']);
      socket.in (r_data ['room']).broadcast.emit ('Born', r_data);
  });

  io.on ('AI_Born', function (r_data) {
    ai_room [r_data ['room']] = socket.id;
    socket.join (r_data ['room'])
  });

  io.on ('MoveMent', function (r_data) {
    socket.in (user [r_data ['user'], 'room']).broadcast.emit ('MoveMent', r_data);
  });
});
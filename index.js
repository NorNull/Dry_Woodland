var express = require ('express');
var app = express ();
var http = require ('http').createServer (app);
var io = require ('socket.io')(http);

app.set ('port', process.env.PORT || 3000);

app.get ('/', getRoot);

function getRoot (req, res) {
  res.send ("Server is running : " + server.address ().address + server.address ().port);
}
var user = [,]
var ai_room = [];

io.on ('connection', function (socket) {
  socket.on ('Born', function (r_data) {
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

  socket.on ('AI_Born', function (r_data) {
    ai_room [r_data ['room']] = socket.id;
    socket.join (r_data ['room'])
  });

  socket.on ('MoveMent', function (r_data) {
    socket.in (user [r_data ['user'], 'room']).broadcast.emit ('MoveMent', r_data);
  });
});

http.listen (app.get ('port'), function () {
  console.log ("Server is running");
});

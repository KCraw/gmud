const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const Room = require('./src/Room')(io);
const Player = require('./src/Player');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// REMOVE THIS CODE
let playerCounter = 1;
io.on('connection', socket => {
  const player = new Player({ id: playerCounter, name: `Player${playerCounter}` }, socket);
  playerCounter += 1;
  socket.on('disconnect', () => {
    player.destroy();
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

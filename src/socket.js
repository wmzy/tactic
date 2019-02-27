import Server from 'socket.io';

const io = new Server({
  path: '/io',
  serveClient: false
});

io.on('connection', socket => {
  console.log('a user connected', socket.handshake.query.username);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

module.exports = io;

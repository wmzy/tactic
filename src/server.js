import http from 'http';
import io from './socket';
import app from './app';

const port = process.env.PORT || 3000;

const server = http.createServer(app.callback());
io.attach(server);

// eslint-disable-next-line no-console
server.listen(port, () => console.log(`listening on *:${port}`));


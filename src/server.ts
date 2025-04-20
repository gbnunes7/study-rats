import { app } from './app';
import http from 'node:http';
import { env } from './lib/env/env-validator';
import { createWebSocketServer } from './modules/shared/websocket/websocket-server';
import { setupRoutes } from './routes';
import { handleMessageConnection } from './modules/message/websocket/chat-gateway';

setupRoutes(app);
const server = http.createServer(app);

createWebSocketServer({
  server,
  onConnection: handleMessageConnection,
});

server.listen(env.PORT, () => {
  console.log('Server + Ws is running on port ', env.PORT);
});

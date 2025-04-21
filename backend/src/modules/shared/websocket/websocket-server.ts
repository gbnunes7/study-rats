import { WebSocket } from 'ws';
import type { IncomingMessage, Server } from 'node:http';

interface WebSocketAppOptions {
  server: Server;
  onConnection: (socket: WebSocket, request: IncomingMessage) => void;
}

export const createWebSocketServer = ({
  server,
  onConnection,
}: WebSocketAppOptions) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (socket: WebSocket, request: IncomingMessage) => {
    console.log('New client connected');
    onConnection(socket, request);

    socket.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return wss;
};

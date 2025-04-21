import type { WebSocket } from 'ws';
import { MessageService } from '../services/message-service';
import { MessageRepository } from '../repositories/prisma-repository';
import { prismaInstance } from '../../../prisma/prisma-instance';
import url from 'node:url';
import { verifyJwt } from '../../../utils/verify-jwt';
import type { IncomingMessage } from 'node:http';

const connectionsByGroup = new Map<number, Set<WebSocket>>();

const messageService = new MessageService(
  new MessageRepository(prismaInstance),
);

export async function handleMessageConnection(
  socket: WebSocket,
  req: IncomingMessage,
) {
  const { query } = url.parse(req.url || '', true);
  const token = query?.token as string;

  const user = verifyJwt(token);

  if (!user) {
    socket.close();
    return;
  }
  let userId: number | null = null;
  let groupId: number | null = null;

  socket.on('message', async (data) => {
    try {
      const parsed = JSON.parse(data.toString());
      const { type, payload } = parsed;

      if (type === 'JOIN') {
        userId = payload.userId;
        groupId = payload.groupId;

        if (!connectionsByGroup.has(groupId!)) {
          connectionsByGroup.set(groupId!, new Set());
        }

        connectionsByGroup.get(groupId!)?.add(socket);

        socket.send(JSON.stringify({ type: 'JOINED', payload: { groupId } }));
      }

      if (type === 'SEND_MESSAGE') {
        if (!userId || !groupId) {
          socket.send(
            JSON.stringify({
              type: 'ERROR',
              payload: { message: 'Not joined in group' },
            }),
          );
          return;
        }

        const message = await messageService.createMessage({
          content: payload.content,
          groupId,
          userId,
        });

        const response = JSON.stringify({
          type: 'NEW_MESSAGE',
          payload: {
            id: message.id,
            content: message.content,
            userId: message.user_id,
            groupId: message.group_id,
            createdAt: message.created_at,
          },
        });

        for (const client of connectionsByGroup.get(groupId) ?? []) {
          if (client.readyState === 1) {
            client.send(response);
          }
        }
      }
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (err: any) {
      socket.send(
        JSON.stringify({ type: 'ERROR', payload: { message: err.message } }),
      );
    }
  });

  socket.on('close', () => {
    if (groupId) {
      connectionsByGroup.get(groupId)?.delete(socket);
    }
  });
}

import type { NextFunction, Request, Response } from 'express';
import { prismaInstance } from '../../../prisma/prisma-instance';
import { MessageRepository } from '../repositories/prisma-repository';
import { MessageService } from '../services/message-service';
import { z } from 'zod';

const messageRepository = new MessageRepository(prismaInstance);
const messageService = new MessageService(messageRepository);

class MessageController {
  constructor(private messageService: MessageService) {
    this.getMessagesByGroupId = this.getMessagesByGroupId.bind(this);
    this.createMessage = this.createMessage.bind(this);
  }

  async createMessage(req: Request, res: Response, next: NextFunction) {
    const bodySchema = z.object({
      content: z.string().min(1).max(500),
    });

    const paramSchema = z.object({
      groupId: z.string(),
      userId: z.string(),
    });

    try {
      const { content } = bodySchema.parse(req.body);
      const { groupId, userId } = paramSchema.parse(req.params);

      const groupIdNumber = Number(groupId);
      const userIdNumber = Number(userId);

      const message = await this.messageService.createMessage({
        content,
        groupId: groupIdNumber,
        userId: userIdNumber,
      });

      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  }

  async getMessagesByGroupId(req: Request, res: Response, next: NextFunction) {
    const paramSchema = z.object({
      groupId: z.string(),
    });

    try {
      const { groupId } = paramSchema.parse(req.params);
      const groupIdNumber = Number(groupId);

      const messages =
        await this.messageService.getMessagesByGroupId(groupIdNumber);

      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  }
}
const messageController = new MessageController(messageService);

export { messageController };

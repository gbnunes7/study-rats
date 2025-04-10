import { z } from 'zod';
import { GroupService } from '../services/group-service';
import type { NextFunction, Request, Response } from 'express';
import { Subject } from '@prisma/client';
import { GroupRepository } from '../repositories/prisma-repository';
import { prismaInstance } from '../../../prisma/prisma-instance';

const groupRepository = new GroupRepository(prismaInstance);
const groupService = new GroupService(groupRepository);

class GroupController {
  constructor(private groupService: GroupService) {}

  async createGroup(req: Request, res: Response, next: NextFunction) {
    const bodySchema = z.object({
      name: z.string(),
      subject: z.nativeEnum(Subject),
      description: z.string().optional(),
      privacy: z.enum(['PUBLIC', 'PRIVATE']),
    });

    const paramsSchema = z.object({
      userId: z.string(),
    });

    try {
      const { name, subject, description, privacy } = bodySchema.parse(
        req.body,
      );
      const { userId } = paramsSchema.parse(req.params);

      const userIdNumber = Number(userId);

      const group = await this.groupService.createGroup({
        name,
        subject,
        description,
        privacy,
        userId: userIdNumber,
      });

      res.status(201).json({ message: 'Group created successfully', group });
    } catch (error) {
      next(error);
    }
  }

  async enterInGroup(req: Request, res: Response, next: NextFunction) {
    const paramsSchema = z.object({
      groupId: z.string(),
      userId: z.string(),
    });

    try {
      const { groupId, userId } = paramsSchema.parse(req.params);

      const groupIdNumber = Number(groupId);
      const userIdNumber = Number(userId);

      const group = await this.groupService.enterInGroup(
        groupIdNumber,
        userIdNumber,
      );

      res.status(200).json({ message: 'Entered in group successfully', group });
    } catch (error) {
      next(error);
    }
  }
}
const groupController = new GroupController(groupService);

export { groupController };

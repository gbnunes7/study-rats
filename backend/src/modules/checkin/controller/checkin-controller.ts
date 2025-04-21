import type { NextFunction, Request, Response } from 'express';
import { prismaInstance } from '../../../prisma/prisma-instance';
import { CheckinRepository } from '../repositories/prisma-repository';
import { CheckinService } from '../services/checkin-service';
import { z } from 'zod';

const checkinRepository = new CheckinRepository(prismaInstance);
const checkinService = new CheckinService(checkinRepository);

class CheckinController {
  constructor(private checkinService: CheckinService) {
    this.createCheckin = this.createCheckin.bind(this);
    this.getCheckinsByGroupId = this.getCheckinsByGroupId.bind(this);
    this.deleteCheckinById = this.deleteCheckinById.bind(this);
    this.getCheckinById = this.getCheckinById.bind(this);
    this.editCheckinById = this.editCheckinById.bind(this);
  }

  async createCheckin(req: Request, res: Response, next: NextFunction) {
    const schema = z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      studyTime: z.string().min(1),
      commits: z.string().min(1),
    });

    const paramsSchema = z.object({
      userId: z.string().min(1),
      groupId: z.string().min(1),
    });

    try {
      const { file } = req;
      const { commits, description, studyTime, title } = schema.parse(req.body);
      const { groupId, userId } = paramsSchema.parse(req.params);

      const groupIdNumber = Number(groupId);
      const userIDNumber = Number(userId);
      const commitsNumber = Number(commits);
      const studyTimeNumber = Number(studyTime);

      const checkin = await this.checkinService.createCheckin({
        commits: commitsNumber,
        description,
        studyTime: studyTimeNumber,
        title,
        file,
        groupId: groupIdNumber,
        userId: userIDNumber,
      });

      res.status(201).json({ checkin });
    } catch (error) {
      next(error);
    }
  }

  async getCheckinsByGroupId(req: Request, res: Response, next: NextFunction) {
    const schema = z.object({
      groupId: z.string().min(1),
    });

    try {
      const { groupId } = schema.parse(req.params);

      const checkin = await this.checkinService.getCheckinsByGroupId(
        Number(groupId),
      );

      res.status(200).json({ checkin });
    } catch (error) {
      next(error);
    }
  }

  async deleteCheckinById(req: Request, res: Response, next: NextFunction) {
    const schema = z.object({
      checkinId: z.string().min(1),
    });

    try {
      const { checkinId } = schema.parse(req.params);

      const checkin = await this.checkinService.deleteCheckinById(
        Number(checkinId),
      );

      res.status(200).json({ checkin });
    } catch (error) {
      next(error);
    }
  }

  async getCheckinById(req: Request, res: Response, next: NextFunction) {
    const schema = z.object({
      checkinId: z.string().min(1),
    });

    try {
      const { checkinId } = schema.parse(req.params);

      const checkin = await this.checkinService.getCheckinById(
        Number(checkinId),
      );

      res.status(200).json({ checkin });
    } catch (error) {
      next(error);
    }
  }

  async editCheckinById(req: Request, res: Response, next: NextFunction) {
    const schema = z.object({
      checkinId: z.string().min(1),
    });

    const bodySchema = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      studyTime: z.number().optional(),
      commits: z.number().optional(),
      imageUrl: z.string().optional(),
    });

    try {
      const { checkinId } = schema.parse(req.params);
      const data = bodySchema.parse(req.body);

      const checkin = await this.checkinService.editCheckinById(
        Number(checkinId),
        data,
      );

      res.status(200).json({ checkin });
    } catch (error) {
      next(error);
    }
  }
}

const checkinController = new CheckinController(checkinService);
export { checkinController };

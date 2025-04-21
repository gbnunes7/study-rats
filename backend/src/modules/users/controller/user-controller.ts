import type { NextFunction, Request, Response } from 'express';
import { UserServices } from '../services/user-service';
import { z } from 'zod';
import { UserRepository } from '../repositories/prisma-repository';
import { prismaInstance } from '../../../prisma/prisma-instance';

const userRepository = new UserRepository(prismaInstance);
const userServices = new UserServices(userRepository);

class UserController {
  constructor(private userServices: UserServices) {
    this.deleteUserById = this.deleteUserById.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    const schema = z.object({
      userId: z.string(),
    });
    try {
      const { userId } = schema.parse(req.params);
      const user = await this.userServices.getUserById(Number(userId));

      if (user.isLeft()) {
        res.status(404).json({ error: user.value.message });
        return;
      }

      res.status(200).json(user.value);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    const schema = z.object({
      userId: z.string(),
      data: z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
      }),
    });

    try {
      const { userId, data } = schema.parse({ ...req.params, ...req.body });
      const user = await this.userServices.updateUser(Number(userId), data);

      if (user.isLeft()) {
        res.status(404).json({ error: user.value.message });
        return;
      }

      res.status(200).json(user.value);
    } catch (error) {
      next(error);
    }
  }

  async deleteUserById(req: Request, res: Response, next: NextFunction) {
    const schema = z.object({
      userId: z.string(),
    });

    try {
      const { userId } = schema.parse(req.params);
      const user = await this.userServices.deleteUserById(Number(userId));

      if (user.isLeft()) {
        res.status(404).json({ error: user.value.message });
        return;
      }

      res.status(204).json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userServices.getUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
}

const userController = new UserController(userServices);
export { userController };

import type { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth-service';
import { z } from 'zod';
import jsonwebtoken from 'jsonwebtoken';
import { AuthRepository } from '../repositories/prisma-repository';
import { prismaInstance } from '../../../prisma/prisma-instance';
import { BcryptHasher } from '../cryptography/cryptography-bcrypt-hash';

const authRepository = new AuthRepository(prismaInstance);
const hasher = new BcryptHasher();
const authService = new AuthService(authRepository, hasher, hasher);

class AuthController {
  constructor(private authService: AuthService) {
    this.createUser = this.createUser.bind(this);
    this.createSession = this.createSession.bind(this);
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    const schema = z.object({
      email: z.string().email(),
      name: z.string(),
      password: z.string().min(6),
      subjectInterest: z.array(
        z.enum([
          'JAVASCRIPT',
          'PYTHON',
          'JAVA',
          'C_SHARP',
          'RUBY',
          'PHP',
          'GO',
          'HTML',
          'CSS',
          'PROGRAMMING_LOGIC',
          'DATA_STRUCTURES',
          'ALGORITHMS',
        ]),
      ),
      description: z.string().optional(),
    });

    try {
      const { email, name, password, subjectInterest, description } =
        schema.parse(req.body);

      const user = await this.authService.createUser({
        email,
        name,
        password,
        subjectInterest,
        description,
      });

      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      next(error);
    }
  }

  async createSession(req: Request, res: Response, next: NextFunction) {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    try {
      const { email, password } = schema.parse(req.body);

      const session = await this.authService.createSession({
        email,
        password,
      });

      if (session.isLeft()) {
        const error = session.value;
        res.status(401).json({ message: error.message });
        return;
      }

      const tokenJwt = jsonwebtoken.sign(
        { id: session.value.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '24h',
        },
      );

      res.status(201).json({
        message: 'Session created successfully',
        accessToken: tokenJwt,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    const schema = z.object({
      name: z.string().optional(),
      password: z.string().optional(),
      subjectInterest: z
        .array(
          z.enum([
            'JAVASCRIPT',
            'PYTHON',
            'JAVA',
            'C_SHARP',
            'RUBY',
            'PHP',
            'GO',
            'HTML',
            'CSS',
            'PROGRAMMING_LOGIC',
            'DATA_STRUCTURES',
            'ALGORITHMS',
          ]),
        )
        .optional(),
      description: z.string().optional(),
    });

    const userIdSchema = z.object({
      userId: z.string(),
    });

    try {
      const { name, password, subjectInterest, description } = schema.parse(
        req.body,
      );
      const { userId } = userIdSchema.parse(req.params);

      const dataToUpdate = {
        ...(name && { name }),
        ...(password && { password }),
        ...(subjectInterest && { subjectInterest }),
        ...(description && { description }),
      };

      const updatedUser = await this.authService.updateUser(
        Number(userId),
        dataToUpdate,
      );

      res.status(200).json({
        message: 'User updated successfully',
        updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
}

const authController = new AuthController(authService);

export { authController };

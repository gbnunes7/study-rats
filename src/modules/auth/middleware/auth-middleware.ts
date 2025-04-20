import type { User } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../../lib/env/env-validator';

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res
      .status(401)
      .json({ message: 'Access Denied, verify token is not present ' });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    req.user = decoded as User;

    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;

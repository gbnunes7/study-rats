import jwt from 'jsonwebtoken';

import type { User } from '@prisma/client';
import { env } from '../lib/env/env-validator';

export function verifyJwt(token: string): User | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    return decoded as User;
  } catch {
    return null;
  }
}

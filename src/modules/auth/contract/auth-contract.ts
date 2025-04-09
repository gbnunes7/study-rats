import type { User } from '@prisma/client';
import type { CreateUserDto } from '../dto/auth-dto';

export interface IAuthContract {
  createUser: ({
    email,
    name,
    password,
    subjectInterest,
    description,
  }: CreateUserDto) => Promise<User>;
  findUserByEmail: (email: string) => Promise<User | null>;
  updateUser: (userId: number, data: Partial<User>) => Promise<User>;
}

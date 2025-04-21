import type { User } from '@prisma/client';

export interface IUserContract {
  deleteUserById: (userId: number) => Promise<boolean>;
  getUserById: (userId: number) => Promise<User | null>;
  getUsers: () => Promise<User[]>;
  updateUser: (userId: number, data: Partial<User>) => Promise<User>;
}

import type { PrismaClient, User } from '@prisma/client';
import type { IUserContract } from '../contract/user-contract';

class UserRepository implements IUserContract {
  constructor(private userRepository: PrismaClient) {}

  async deleteUserById(userId: number): Promise<boolean> {
    try {
      await this.userRepository.user.delete({
        where: { id: userId },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getUserById(userId: number): Promise<User | null> {
    const user = await this.userRepository.user.findUnique({
      where: { id: userId },
    });
    return user || null;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.user.findMany();
    return users;
  }

  async updateUser(userId: number, data: Partial<User>): Promise<User> {
    const user = await this.userRepository.user.update({
      where: { id: userId },
      data,
    });
    return user;
  }
}

export { UserRepository };

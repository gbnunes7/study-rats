import type { User } from '@prisma/client';
import type { IUserContract } from '../contract/user-contract';

class InMemoryUserRepository implements IUserContract {
  public users: User[] = [];

  async deleteUserById(userId: number): Promise<boolean> {
    const originalLength = this.users.length;
    this.users = this.users.filter((user) => user.id !== userId);
    return this.users.length < originalLength;
  }

  async getUserById(userId: number): Promise<User | null> {
    const user = this.users.find((user) => user.id === userId);
    return user || null;
  }

  async getUsers(): Promise<User[]> {
    return this.users;
  }

  async updateUser(userId: number, data: Partial<User>): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    this.users[userIndex] = { ...this.users[userIndex], ...data };
    return this.users[userIndex];
  }
}

export { InMemoryUserRepository };

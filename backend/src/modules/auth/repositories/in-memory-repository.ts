import type { User } from '@prisma/client';
import type { IAuthContract } from '../contract/auth-contract';
import type { CreateUserDto } from '../dto/auth-dto';

export class InMemoryAuthRepository implements IAuthContract {
  public users: User[] = [];

  async createUser({ email, name, password }: CreateUserDto): Promise<User> {
    const user = {
      id: this.users.length + 1,
      email,
      name,
      password_hash: password,
    } as User;

    this.users.push(user);
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);
    return user || null;
  }

  async updateUser(userId: number, data: Partial<User>): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const updatedUser = { ...this.users[userIndex], ...data };
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }
}

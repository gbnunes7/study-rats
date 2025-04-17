import type { User } from '@prisma/client';
import { type Either, left, right } from '../../../@types/either';
import type { IUserContract } from '../contract/user-contract';
import { UserNotFoundError } from './errors/user-not-found-error';

class UserServices {
  constructor(private userRepository: IUserContract) {}

  async deleteUserById(
    userId: number,
  ): Promise<Either<UserNotFoundError, void>> {
    const userDeleted = await this.userRepository.deleteUserById(userId);

    if (!userDeleted) {
      return left(new UserNotFoundError());
    }

    return right(undefined);
  }

  async getUserById(userId: number): Promise<Either<UserNotFoundError, User>> {
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      return left(new UserNotFoundError());
    }

    return right(user);
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.getUsers();

    return users;
  }

  async updateUser(
    userId: number,
    data: Partial<User>,
  ): Promise<Either<UserNotFoundError, User>> {
    const user = await this.userRepository.updateUser(userId, data);

    if (!user) {
      return left(new UserNotFoundError());
    }

    return right(user);
  }
}

export { UserServices };

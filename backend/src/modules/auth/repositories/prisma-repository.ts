import type { PrismaClient, User } from '@prisma/client';
import type { IAuthContract } from '../contract/auth-contract';
import type { CreateUserDto } from '../dto/auth-dto';

class AuthRepository implements IAuthContract {
  constructor(private authRepository: PrismaClient) {}

  async createUser({
    email,
    name,
    password,
    subjectInterest,
    description,
  }: CreateUserDto): Promise<User> {
    const user = await this.authRepository.user.create({
      data: {
        email,
        name,
        password_hash: password,
        subject_interests: subjectInterest,
        description,
      },
    });

    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.authRepository.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async updateUser(userId: number, data: Partial<User>): Promise<User> {
    const user = await this.authRepository.user.update({
      where: {
        id: userId,
      },
      data,
    });

    return user;
  }
}

export { AuthRepository };

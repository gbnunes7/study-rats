import type { User } from '@prisma/client';
import type { IAuthContract } from '../contract/auth-contract';
import type { CreateSessionDto, CreateUserDto } from '../dto/auth-dto';
import { left, right, type Either } from '../../../@types/either';
import type { HashGenerator } from '../cryptography/cryptography-hash-generator-contract';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { CredentialsInvalidError } from './errors/credentials-invalid-error';
import type { HashComparer } from '../cryptography/cryptograph-hash-comparer-contract';
import * as crypto from 'node:crypto';
import { UserNotFoundError } from './errors/user-not-found-error';

export class AuthService {
  constructor(
    private authRepository: IAuthContract,
    private hashGenerator: HashGenerator,
    private hashComparer: HashComparer,
  ) {}

  async createUser({
    email,
    name,
    password,
    subjectInterest,
    description,
  }: CreateUserDto): Promise<Either<UserAlreadyExistsError, User>> {
    const isUserExists = await this.authRepository.findUserByEmail(email);

    if (isUserExists) {
      return left(new UserAlreadyExistsError());
    }

    const passwordHashed = await this.hashGenerator.hash(password);

    const user = await this.authRepository.createUser({
      email,
      name,
      subjectInterest,
      description,
      password: passwordHashed,
    });

    const userWithoutPassword = {
      ...user,
      password_hash: '',
    } as User;

    return right(userWithoutPassword);
  }

  async createSession({
    email,
    password,
  }: CreateSessionDto): Promise<Either<Error, User>> {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      return left(new CredentialsInvalidError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      return left(new CredentialsInvalidError());
    }

    return right(user);
  }

  async forgotPassword(
    email: string,
  ): Promise<Either<CredentialsInvalidError, void>> {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      return left(new CredentialsInvalidError());
    }

    const resetPasswordToken = await crypto.randomBytes(32).toString('hex');
    const resetTokenExpiresIn = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // TODO: Implement email sender with token

    return right(undefined);
  }

  async updateUser(
    userId: number,
    data: Partial<User>,
  ): Promise<Either<Error, User>> {
    const user = await this.authRepository.updateUser(userId, data);

    if (!user) {
      return left(new UserNotFoundError());
    }

    const userWithoutPassword = {
      ...user,
      password_hash: '',
    } as User;

    return right(userWithoutPassword);
  }
}

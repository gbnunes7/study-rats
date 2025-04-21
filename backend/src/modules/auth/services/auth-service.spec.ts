import { describe, expect, it } from 'vitest';
import { InMemoryAuthRepository } from '../repositories/in-memory-repository';
import { AuthService } from './auth-service';
import { beforeEach } from 'vitest';
import { FakeHasher } from '../repositories/cryptography-repository';

let userRepository: InMemoryAuthRepository;
let sut: AuthService;
let fakeComparer: FakeHasher;
let fakeHasher: FakeHasher;

describe('AuthService', () => {
  beforeEach(() => {
    userRepository = new InMemoryAuthRepository();
    fakeComparer = new FakeHasher();
    fakeHasher = new FakeHasher();
    sut = new AuthService(userRepository, fakeHasher, fakeComparer);
  });

  it('should be able to create a user', async () => {
    const user = await sut.createUser({
      email: 'any_email',
      name: 'any_name',
      password: 'any_password',
      subjectInterest: ['JAVASCRIPT', 'ALGORITHMS'],
      description: 'any_description',
    });

    expect(user.isRight()).toBeTruthy();
  });

  it('should not be able to create a user with an existing email', async () => {
    await sut.createUser({
      email: 'any_email',
      name: 'any_name',
      password: 'any_password',
      subjectInterest: ['JAVASCRIPT', 'ALGORITHMS'],
      description: 'any_description',
    });

    const user = await sut.createUser({
      email: 'any_email',
      name: 'any_name',
      password: 'any_password',
      subjectInterest: ['JAVASCRIPT', 'ALGORITHMS'],
      description: 'any_description',
    });

    expect(user.isLeft()).toBeTruthy();
  });

  it('should be able to create a session', async () => {
    await sut.createUser({
      email: 'any_email',
      name: 'any_name',
      password: 'any_password',
      subjectInterest: ['JAVASCRIPT', 'ALGORITHMS'],
      description: 'any_description',
    });

    const session = await sut.createSession({
      email: 'any_email',
      password: 'any_password',
    });

    expect(session.isRight()).toBeTruthy();
  });

  it('should not be able to create a session with invalid credentials', async () => {
    await sut.createUser({
      email: 'any_email',
      name: 'any_name',
      password: 'any_password',
      subjectInterest: ['JAVASCRIPT', 'ALGORITHMS'],
      description: 'any_description',
    });

    const session = await sut.createSession({
      email: 'invalid_email',
      password: 'any_password',
    });

    expect(session.isLeft()).toBeTruthy();
  });
  it('should not be able to create a session with invalid password', async () => {
    await sut.createUser({
      email: 'any_email',
      name: 'any_name',
      password: 'any_password',
      subjectInterest: ['JAVASCRIPT', 'ALGORITHMS'],
      description: 'any_description',
    });

    const session = await sut.createSession({
      email: 'any_email',
      password: 'invalid_password',
    });

    expect(session.isLeft()).toBeTruthy();
  });

  it('should be able to update an user', async () => {
    const user = await sut.createUser({
      email: 'any_email',
      name: 'any_name',
      password: 'any_password',
      subjectInterest: ['JAVASCRIPT', 'ALGORITHMS'],
      description: 'any_description',
    });

    if (user.isRight()) {
      const updatedUser = await sut.updateUser(user.value.id, {
        name: 'new_name',
      });

      expect(updatedUser.isRight()).toBeTruthy();
      expect(updatedUser.value.name).toBe('new_name');
    }
  });
});

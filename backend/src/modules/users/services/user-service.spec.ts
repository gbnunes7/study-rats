import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InMemoryUserRepository } from '../repositories/in-memory-repository';
import { UserServices } from './user-service';

let userRepository: InMemoryUserRepository;
let sut: UserServices;

describe('UserServices', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new UserServices(userRepository);

    // biome-ignore lint/suspicious/noExplicitAny: mocking test
    (userRepository as any).createUser = vi.fn((user) => {
      userRepository.users.push(user);
    });
  });

  it('should be able to update an user', async () => {
    const userId = 1;
    const initialUser = { id: userId, name: 'Jane Doe' };
    const updatedData = { name: 'John Doe' };
    const expectedUser = { id: userId, name: 'John Doe' };

    // biome-ignore lint/suspicious/noExplicitAny: <mockingTest>
    (userRepository as any).createUser(initialUser);

    const result = await sut.updateUser(userId, updatedData);

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(expectedUser);
  });

  it('should return an error if user not found', async () => {
    const userId = 999;
    const updatedData = { name: 'Non-existent User' };

    await expect(sut.updateUser(userId, updatedData)).rejects.toThrowError(
      'User not found',
    );
  });

  it('should be able to delete an user', async () => {
    const userId = 1;
    const initialUser = { id: userId, name: 'Jane Doe' };

    // biome-ignore lint/suspicious/noExplicitAny: <mockingTest>
    (userRepository as any).createUser(initialUser);

    const result = await sut.deleteUserById(userId);

    expect(result.isRight()).toBe(true);
    expect(userRepository.users).toHaveLength(0);
  });

  it('should return an error if user not found when deleting', async () => {
    const userId = 999;

    const result = await sut.deleteUserById(userId);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(Error);
  });

  it('should be able to get an user by id', async () => {
    const userId = 1;
    const initialUser = { id: userId, name: 'Jane Doe' };

    // biome-ignore lint/suspicious/noExplicitAny: <mockingTest>
    (userRepository as any).createUser(initialUser);

    const result = await sut.getUserById(userId);

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(initialUser);
  });

  it('should return an error if user not found when getting by id', async () => {
    const userId = 999;

    const result = await sut.getUserById(userId);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(Error);
  });

  it('should be able to get all users', async () => {
    const initialUser1 = { id: 1, name: 'Jane Doe' };
    const initialUser2 = { id: 2, name: 'John Doe' };

    // biome-ignore lint/suspicious/noExplicitAny: <mockingTest>
    (userRepository as any).createUser(initialUser1);
    // biome-ignore lint/suspicious/noExplicitAny: <mockingTest>
    (userRepository as any).createUser(initialUser2);

    const result = await sut.getUsers();

    expect(result).toHaveLength(2);
    expect(result).toEqual([initialUser1, initialUser2]);
  });

  it('should return an empty array if no users exist', async () => {
    const result = await sut.getUsers();

    expect(result).toHaveLength(0);
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { GroupService } from './group-service';
import { InvalidPrivacyTypeError } from './errors/invalid-privacy-type-error';
import { UserHasReachedTheLimitError } from './errors/user-has-reached-the-limit-error';
import { InMemoryGroupRepository } from '../repositories/in-memory-repository';
import { GroupNotFoundError } from './errors/group-not-found-error';
import { UserAlreadyInGroupError } from './errors/user-already-in-group-error';
import { GroupHasReachedTheLimitError } from './errors/group-has-reached-the-limit-error';

let groupRepository: InMemoryGroupRepository;
let sut: GroupService;

describe('GroupService', () => {
  beforeEach(() => {
    groupRepository = new InMemoryGroupRepository();
    sut = new GroupService(groupRepository);
  });

  it('should be able to create a group', async () => {
    const result = await sut.createGroup({
      name: 'Study Group',
      subject: 'ALGORITHMS',
      description: 'Group for math lovers',
      privacy: 'PUBLIC',
      userId: 1,
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value).toHaveProperty('id');
      expect(result.value.name).toBe('Study Group');
    }
  });

  it('should not be able to create a group with invalid privacy', async () => {
    const result = await sut.createGroup({
      name: 'Study Group',
      subject: 'ALGORITHMS',
      description: 'Group for math lovers',
      // biome-ignore lint/suspicious/noExplicitAny: for test
      privacy: 'INVALID_PRIVACY' as any,
      userId: 1,
    });

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidPrivacyTypeError);
    }
  });

  it('should not be able to create a group if user has reached the limit', async () => {
    const userId = 1;

    for (let i = 0; i < 4; i++) {
      await groupRepository.createGroup({
        name: `Group ${i}`,
        subject: 'ALGORITHMS',
        description: 'Description',
        privacy: 'PUBLIC',
        userId,
      });
    }

    const result = await sut.createGroup({
      name: 'New Group',
      subject: 'ALGORITHMS',
      description: 'Another group',
      privacy: 'PUBLIC',
      userId,
    });

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UserHasReachedTheLimitError);
    }
  });
  it('should be able to enter in a group', async () => {
    const group = await groupRepository.createGroup({
      name: 'Study Group',
      subject: 'ALGORITHMS',
      description: 'Description',
      privacy: 'PUBLIC',
      userId: 1,
    });

    const result = await sut.enterInGroup(group.id, 2);

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.id).toBe(group.id);
    }
  });

  it('should not be able to enter a non-existing group', async () => {
    const result = await sut.enterInGroup(999, 1);

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(GroupNotFoundError);
    }
  });

  it('should not allow a user to enter twice in the same group', async () => {
    const group = await groupRepository.createGroup({
      name: 'Study Group',
      subject: 'ALGORITHMS',
      description: 'Description',
      privacy: 'PUBLIC',
      userId: 1,
    });

    await sut.enterInGroup(group.id, 2);

    const result = await sut.enterInGroup(group.id, 2);
    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UserAlreadyInGroupError);
    }
  });

  it('should not allow user to enter a full group (user_count > user_limit)', async () => {
    const group = await groupRepository.createGroup({
      name: 'Small Group',
      subject: 'ALGORITHMS',
      description: 'Only 1 user allowed',
      privacy: 'PUBLIC',
      userId: 1,
    });

    group.user_limit = 1;
    group.user_count = 1;

    const result = await sut.enterInGroup(group.id, 3);

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(GroupHasReachedTheLimitError);
    }
  });

  it('should increase user_count when a user enters the group', async () => {
    const group = await groupRepository.createGroup({
      name: 'Growing Group',
      subject: 'ALGORITHMS',
      description: 'Lots of people',
      privacy: 'PUBLIC',
      userId: 1,
    });

    await sut.enterInGroup(group.id, 2);

    const updatedGroup = await groupRepository.getGroupById(group.id);

    expect(updatedGroup?.user_count).toBe(1); 
  });
});

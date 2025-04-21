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

    const groupInRepo = groupRepository.groups.find((g) => g.id === group.id);

    if (groupInRepo) {
      groupInRepo.user_limit = 1;
      groupInRepo.user_count = 1;
    }

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

  it('should return public groups with vacancies', async () => {
    await groupRepository.createGroup({
      name: 'Public Group 1',
      subject: 'ALGORITHMS',
      description: 'Description',
      privacy: 'PUBLIC',
      userId: 1,
    });

    await groupRepository.createGroup({
      name: 'Private Group 2',
      subject: 'ALGORITHMS',
      description: 'Description',
      privacy: 'PRIVATE',
      userId: 2,
    });

    const result = await sut.getPublicGroupsWithVacancies();

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.length).toBe(1);
      expect(result.value[0].name).toBe('Public Group 1');
    }
  });

  it('should return an empty array if there are no public groups with vacancies', async () => {
    await groupRepository.createGroup({
      name: 'Full Group',
      subject: 'ALGORITHMS',
      description: 'Description',
      privacy: 'PUBLIC',
      userId: 1,
    });

    const groupInRepo = groupRepository.groups.find(
      (g) => g.name === 'Full Group',
    );

    if (groupInRepo) {
      groupInRepo.user_limit = 1;
      groupInRepo.user_count = 1;
    }

    const result = await sut.getPublicGroupsWithVacancies();

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.length).toBe(0);
    }
  });

  it('should return an empty array if there are no public groups', async () => {
    await groupRepository.createGroup({
      name: 'Full Group',
      subject: 'ALGORITHMS',
      description: 'Description',
      privacy: 'PRIVATE',
      userId: 1,
    });

    const result = await sut.getPublicGroupsWithVacancies();

    const groups = result.value;

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(groups!.length).toBe(0);
    }
  });

  it('should generate a code if the group is private', async () => {
    const result = await sut.createGroup({
      name: 'Study Group',
      subject: 'ALGORITHMS',
      description: 'Group for math lovers',
      privacy: 'PRIVATE',
      userId: 1,
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.entry_code).toBeDefined();
    }
  });

  it('should not generate a code if the group is public', async () => {
    const result = await sut.createGroup({
      name: 'Study Group',
      subject: 'ALGORITHMS',
      description: 'Group for math lovers',
      privacy: 'PUBLIC',
      userId: 1,
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.entry_code).toBeUndefined();
    }
  });

  it('should return a group by entry code', async () => {
    const result = await sut.createGroup({
      name: 'Study Group',
      subject: 'ALGORITHMS',
      description: 'Group for math lovers',
      privacy: 'PRIVATE',
      userId: 1,
    });

    if (result.isRight()) {
      const createdGroup = result.value;

      const groupFound = await sut.getPrivateGroupForEntryCode(
        createdGroup.entry_code as string,
      );

      expect(groupFound.isRight()).toBeTruthy();
      if (groupFound.isRight()) {
        expect(groupFound.value.id).toBe(createdGroup.id);
        expect(groupFound.value.entry_code).toBe(createdGroup.entry_code);
      }
    }
  });
  it('should not return a group if the entry code is invalid', async () => {
    const result = await sut.getPrivateGroupForEntryCode('INVALID_CODE');

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(GroupNotFoundError);
    }
  });

  it('should not return a group if the group is public', async () => {
    const result = await sut.createGroup({
      name: 'Study Group',
      subject: 'ALGORITHMS',
      description: 'Group for math lovers',
      privacy: 'PUBLIC',
      userId: 1,
    });

    if (result.isRight()) {
      const createdGroup = result.value;

      const groupFound = await sut.getPrivateGroupForEntryCode(
        createdGroup.entry_code as string,
      );

      expect(groupFound.isLeft()).toBeTruthy();
      if (groupFound.isLeft()) {
        expect(groupFound.value).toBeInstanceOf(GroupNotFoundError);
      }
    }
  });

  it('should return a group by entry code', async () => {
    const result = await sut.createGroup({
      name: 'Study Group',
      subject: 'ALGORITHMS',
      description: 'Group for math lovers',
      privacy: 'PRIVATE',
      userId: 1,
    });

    if (result.isRight()) {
      const createdGroup = result.value;

      const groupFound = await sut.getPrivateGroupForEntryCode(
        createdGroup.entry_code as string,
      );

      expect(groupFound.isRight()).toBeTruthy();
      if (groupFound.isRight()) {
        expect(groupFound.value.id).toBe(createdGroup.id);
        expect(groupFound.value.entry_code).toBe(createdGroup.entry_code);
      }
    }
  });

  it('should not return a group if the entry code is invalid', async () => {
    const result = await sut.getPrivateGroupForEntryCode('INVALID_CODE');

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(GroupNotFoundError);
    }
  });

  it('should user enter in a group with entry code', async () => {
    const group = await groupRepository.createGroup({
      name: 'Study Group',
      subject: 'ALGORITHMS',
      description: 'Group for math lovers',
      privacy: 'PRIVATE',
      userId: 1,
    });
    const result = await sut.enterInPrivateGroup(group.entry_code!, 2);

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.id).toBe(group.id);
    }
    const groupFound = await groupRepository.getGroupById(group.id);
    expect(groupFound).toBeDefined();
    if (groupFound) {
      expect(groupFound.user_count).toBe(1);
    }
  });

  it('should not allow user to enter a group with invalid entry code', async () => {
    const result = await sut.enterInPrivateGroup('INVALID_CODE', 1);

    expect(result.isLeft()).toBeTruthy();
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(GroupNotFoundError);
    }
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { GroupService } from './group-service';
import { InvalidPrivacyTypeError } from './errors/invalid-privacy-type-error';
import { UserHasReachedTheLimitError } from './errors/user-has-reached-the-limit-error';
import { InMemoryGroupRepository } from '../repositories/in-memory-repository';

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
});

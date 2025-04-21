import { describe, it, expect, beforeEach } from 'vitest';
import { CheckinService } from './checkin-service';
import { InMemoryCheckinRepsitory } from '../repositories/in-memory-repository';
import type { CreateCheckinDto } from '../dto/checkin-dto';

let sut: CheckinService;

describe('CheckinService', () => {
  beforeEach(() => {
    const inMemoryRepo = new InMemoryCheckinRepsitory();
    sut = new CheckinService(inMemoryRepo);
  });

  const basePayload: CreateCheckinDto = {
    title: 'My first check-in',
    description: 'Studied clean architecture',
    studyTime: 120,
    commits: 5,
    userId: 1,
    groupId: 1,
    imageUrl: 'null',
  };

  it('should create a valid checkin', async () => {
    const result = await sut.createCheckin(basePayload);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.title).toBe(basePayload.title);
      expect(result.value.study_time).toBe(basePayload.studyTime);
    }
  });

  it('should not create checkin with 0 commits', async () => {
    const result = await sut.createCheckin({
      ...basePayload,
      commits: 0,
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value.message).toBe('Commits must be greater than 0');
    }
  });

  it('should not create checkin with 0 studyTime', async () => {
    const result = await sut.createCheckin({
      ...basePayload,
      studyTime: 0,
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value.message).toBe('Study time must be greater than 0');
    }
  });

  it('should retrieve checkins by groupId', async () => {
    await sut.createCheckin(basePayload);
    const result = await sut.getCheckinsByGroupId(basePayload.groupId);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.length).toBe(1);
      expect(result.value[0].group_id).toBe(basePayload.groupId);
    }
  });

  it('should delete a checkin by ID', async () => {
    const created = await sut.createCheckin(basePayload);
    const id = created.isRight() ? created.value.id : -1;

    const deleted = await sut.deleteCheckinById(id);

    expect(deleted.isRight()).toBe(true);
    if (deleted.isRight()) {
      expect(deleted.value.id).toBe(id);
    }
  });

  it('should return error when deleting non-existent checkin', async () => {
    try {
      await sut.deleteCheckinById(999);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      if (error instanceof Error) {
        expect(error.message).toContain('Checkin with ID 999 not found');
      }
    }
  });

  it('should update a checkin', async () => {
    const created = await sut.createCheckin(basePayload);
    const id = created.isRight() ? created.value.id : -1;

    const result = await sut.editCheckinById(id, { title: 'Updated title' });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.title).toBe('Updated title');
    }
  });

  it('should get a checkin by ID', async () => {
    const created = await sut.createCheckin(basePayload);
    const id = created.isRight() ? created.value.id : -1;

    const checkin = await sut.getCheckinById(id);

    expect(checkin).not.toBeNull();
    expect(checkin?.id).toBe(id);
  });

  it('should return null if checkin not found by ID', async () => {
    const checkin = await sut.getCheckinById(999);
    expect(checkin).toBeNull();
  });
});

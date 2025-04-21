import type { Checkin } from '@prisma/client';
import type { ICheckinContract } from '../contract/checkin-contract';
import type { CreateCheckinDto } from '../dto/checkin-dto';
import e from 'express';

class InMemoryCheckinRepsitory implements ICheckinContract {
  public checkins: Checkin[] = [];

  async createCheckin({
    commits,
    description,
    studyTime,
    title,
    userId,
    groupId
  }: CreateCheckinDto): Promise<Checkin> {
    const newCheckin: Checkin = {
      id: this.checkins.length + 1,
      title,
      description: description || null,
      study_time: studyTime,
      commits,
      image_url: null,
      user_id: userId,
      group_id: groupId ?? 0,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.checkins.push(newCheckin);
    return newCheckin;
  }

  async getCheckinsByGroupId(groupId: number): Promise<Checkin[]> {
    return this.checkins.filter((checkin) => checkin.group_id === groupId);
  }

  async deleteCheckinById(checkinId: number): Promise<Checkin> {
    const index = this.checkins.findIndex(
      (checkin) => checkin.id === checkinId,
    );
    if (index !== -1) {
      return this.checkins.splice(index, 1)[0];
    }
    throw new Error(`Checkin with ID ${checkinId} not found`);
  }

  async getCheckinById(checkinId: number): Promise<Checkin | null> {
    return this.checkins.find((checkin) => checkin.id === checkinId) || null;
  }

  async updateCheckinById(
    checkinId: number,
    data: Partial<Checkin>,
  ): Promise<Checkin> {
    const checkin = await this.getCheckinById(checkinId);

    if (!checkin) {
      throw new Error(`Checkin with ID ${checkinId} not found`);
    }

    Object.assign(checkin, data);
    checkin.updated_at = new Date();
    return checkin;
  }

  async getCheckinsByUserId(userId: number): Promise<Checkin[]> {
    return this.checkins.filter((checkin) => checkin.user_id === userId);
  }
}

export { InMemoryCheckinRepsitory };
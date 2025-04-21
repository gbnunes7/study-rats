import type { Checkin } from '@prisma/client';
import type { CreateCheckinDto } from '../dto/checkin-dto';

export interface ICheckinContract {
  createCheckin: ({
    commits,
    description,
    studyTime,
    groupId,
    title,
    userId,
    imageUrl
  }: CreateCheckinDto) => Promise<Checkin>;
  getCheckinsByGroupId: (groupId: number) => Promise<Checkin[]>;
  deleteCheckinById: (checkinId: number) => Promise<Checkin>;
  getCheckinById: (checkinId: number) => Promise<Checkin | null>;
  updateCheckinById: (
    checkinId: number,
    data: Partial<Checkin>,
  ) => Promise<Checkin>;
}

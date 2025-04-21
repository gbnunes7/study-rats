import type { Checkin, PrismaClient } from '@prisma/client';
import type { ICheckinContract } from '../contract/checkin-contract';
import type { CreateCheckinDto } from '../dto/checkin-dto';

class CheckinRepository implements ICheckinContract {
  constructor(private prismaClient: PrismaClient) {}

  async createCheckin({
    commits,
    description,
    studyTime,
    title,
    userId,
    imageUrl,
    groupId,
  }: CreateCheckinDto): Promise<Checkin> {
    const checkin = await this.prismaClient.checkin.create({
      data: {
        commits,
        group_id: groupId,
        description,
        study_time: studyTime,
        title,
        user_id: userId,
        image_url: imageUrl,
      },
    });

    return checkin;
  }

  async getCheckinsByGroupId(groupId: number): Promise<Checkin[]> {
    const checkins = await this.prismaClient.checkin.findMany({
      where: {
        group_id: groupId,
      },
    });

    return checkins;
  }

  async deleteCheckinById(checkinId: number): Promise<Checkin> {
    const checkin = await this.prismaClient.checkin.delete({
      where: {
        id: checkinId,
      },
    });
    return checkin;
  }

  async getCheckinById(checkinId: number): Promise<Checkin | null> {
    const checkin = await this.prismaClient.checkin.findUnique({
      where: {
        id: checkinId,
      },
    });

    return checkin;
  }

  async updateCheckinById(
    checkinId: number,
    data: Partial<Checkin>,
  ): Promise<Checkin> {
    const checkin = await this.prismaClient.checkin.update({
      where: {
        id: checkinId,
      },
      data,
    });

    return checkin;
  }
}

export { CheckinRepository };

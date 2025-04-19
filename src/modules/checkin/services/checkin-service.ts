import type { Checkin } from '@prisma/client';
import { type Either, left, right } from '../../../@types/either';
import type { ICheckinContract } from '../contract/checkin-contract';
import type { CreateCheckinDto } from '../dto/checkin-dto';
import { DeleteImageFromBucket } from '../../aws/services/s3-bucket-service-delete';
import { UploadCheckinImage } from '../../aws/services/s3-bucket-service-upload';

class CheckinService {
  constructor(private checkinRepository: ICheckinContract) {}

  async createCheckin({
    commits,
    description,
    studyTime,
    title,
    userId,
    groupId,
    file,
  }: CreateCheckinDto): Promise<Either<Error, Checkin>> {
    if (commits <= 0) {
      return left(new Error('Commits must be greater than 0'));
    }

    if (studyTime <= 0) {
      return left(new Error('Study time must be greater than 0'));
    }

    const s3ImageUrl = await new UploadCheckinImage(file!).execute();

    const checkin = await this.checkinRepository.createCheckin({
      commits,
      description,
      studyTime,
      title,
      userId,
      imageUrl: s3ImageUrl,
      groupId,
    });

    return right(checkin);
  }

  async getCheckinsByGroupId(
    groupId: number,
  ): Promise<Either<null, Checkin[]>> {
    const checkins = await this.checkinRepository.getCheckinsByGroupId(groupId);

    return right(checkins);
  }

  async deleteCheckinById(checkinId: number): Promise<Either<Error, Checkin>> {
    const checkin = await this.checkinRepository.deleteCheckinById(checkinId);

    await new DeleteImageFromBucket(checkin.image_url!).execute();

    if (!checkin) {
      return left(new Error('Checkin not found'));
    }

    return right(checkin);
  }

  async getCheckinById(checkinId: number): Promise<Checkin | null> {
    const checkin = await this.checkinRepository.getCheckinById(checkinId);

    return checkin;
  }

  async editCheckinById(
    checkinId: number,
    data: Partial<Checkin>,
  ): Promise<Either<Error, Checkin>> {
    const checkin = await this.checkinRepository.updateCheckinById(
      checkinId,
      data,
    );

    if (!checkin) {
      return left(new Error('Checkin not found'));
    }

    return right(checkin);
  }
}

export { CheckinService };

import type { Group } from '@prisma/client';
import type { IGroupContract } from '../contract/group-contract';
import type { CreateGroupDto } from '../dto/group-dto';
import { left, right, type Either } from '../../../@types/either';
import { InvalidPrivacyTypeError } from './errors/invalid-privacy-type-error';
import { UserHasReachedTheLimitError } from './errors/user-has-reached-the-limit-error';
import { GroupNotFoundError } from './errors/group-not-found-error';
import { GroupHasReachedTheLimitError } from './errors/group-has-reached-the-limit-error';
import { UserAlreadyInGroupError } from './errors/user-already-in-group-error';
import { generateRandomCode } from '../utils/random-code';

export class GroupService {
  constructor(private groupRepository: IGroupContract) {}

  async createGroup({
    name,
    subject,
    description,
    privacy,
    userId,
    entryCode,
  }: CreateGroupDto): Promise<
    Either<InvalidPrivacyTypeError | UserHasReachedTheLimitError, Group>
  > {
    if (!privacy?.includes('PUBLIC') && !privacy?.includes('PRIVATE')) {
      return left(new InvalidPrivacyTypeError());
    }

    const groupsCreatedByUser =
      await this.groupRepository.getGroupsCreatedByUserId(userId);

    if (groupsCreatedByUser && groupsCreatedByUser.length > 3) {
      return left(new UserHasReachedTheLimitError());
    }

    const group = await this.groupRepository.createGroup({
      name,
      subject,
      description,
      privacy,
      userId,
      entryCode: privacy === 'PRIVATE' ? generateRandomCode() : undefined,
    });

    return right(group);
  }

  async enterInGroup(
    groupId: number,
    userId: number,
  ): Promise<
    Either<
      | GroupNotFoundError
      | GroupHasReachedTheLimitError
      | UserAlreadyInGroupError,
      Group
    >
  > {
    const groupFound = await this.groupRepository.getGroupById(groupId);

    if (!groupFound) {
      return left(new GroupNotFoundError());
    }

    if (groupFound.Users_In_Group.some((user) => user.user_id === userId)) {
      return left(new UserAlreadyInGroupError());
    }

    if (groupFound.user_count >= groupFound.user_limit) {
      return left(new GroupHasReachedTheLimitError());
    }

    const group = await this.groupRepository.enterInGroup(groupId, userId);

    return right(group);
  }

  async getPublicGroupsWithVacancies(): Promise<Either<null, Group[]>> {
    const groups = await this.groupRepository.getPublicGroupsWithVacancies();

    return right(groups.length > 0 ? groups : []);
  }
}

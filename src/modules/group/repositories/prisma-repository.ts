import type { Group, Prisma, PrismaClient } from '@prisma/client';
import type { IGroupContract } from '../contract/group-contract';
import type { CreateGroupDto } from '../dto/group-dto';

class GroupRepository implements IGroupContract {
  constructor(private groupRepository: PrismaClient) {}

  async createGroup({
    name,
    subject,
    description,
    privacy,
    userId,
  }: CreateGroupDto): Promise<Group> {
    const group = await this.groupRepository.group.create({
      data: {
        name,
        subject,
        description,
        privacy,
        user_id: userId,
      },
    });

    return group;
  }

  async getGroupsCreatedByUserId(userId: number): Promise<Group[] | null> {
    const groups = await this.groupRepository.group.findMany({
      where: {
        user_id: userId,
      },
    });

    return groups.length > 0 ? groups : null;
  }

  async getGroupById(groupId: number): Promise<Prisma.GroupGetPayload<{ include: { Users_In_Group: true } }> | null> {
    const group = await this.groupRepository.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        Users_In_Group: true,
      },
    });

    return group;
  }

  async enterInGroup(groupId: number, userId: number): Promise<Group> {
    return this.groupRepository.$transaction(async (tx) => {
      const group = await tx.group.update({
        where: { id: groupId },
        data: {
          user_count: {
            increment: 1,
          },
        },
      });

      await tx.users_In_Group.create({
        data: {
          group_id: groupId,
          user_id: userId,
        },
      });

      return group;
    });
  }
}

export { GroupRepository };

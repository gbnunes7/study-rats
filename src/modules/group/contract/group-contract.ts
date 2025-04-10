import type { Group, Prisma } from '@prisma/client';
import type { CreateGroupDto } from '../dto/group-dto';

export interface IGroupContract {
  createGroup: ({
    name,
    subject,
    description,
    privacy,
  }: CreateGroupDto) => Promise<Group>;
  getGroupsCreatedByUserId: (userId: number) => Promise<Group[] | null>;
  enterInGroup: (groupId: number, userId: number) => Promise<Group>;
  getGroupById: (groupId: number) => Promise<Prisma.GroupGetPayload<{ include: { Users_In_Group: true } }> | null>;
}

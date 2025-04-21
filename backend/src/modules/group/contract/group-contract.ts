import type { Group, Prisma } from '@prisma/client';
import type { CreateGroupDto } from '../dto/group-dto';
import type { GroupPayload } from '../types/group-payload';

export interface IGroupContract {
  createGroup: ({
    name,
    subject,
    description,
    privacy,
    entryCode,
  }: CreateGroupDto) => Promise<Group>;
  getGroupsCreatedByUserId: (userId: number) => Promise<Group[] | null>;
  enterInGroup: (groupId: number, userId: number) => Promise<Group>;
  getGroupById: (groupId: number) => Promise<GroupPayload | null>;
  getPublicGroupsWithVacancies: () => Promise<Group[]>;
  getPrivateGroupForEntryCode: (
    entryCode: string,
  ) => Promise<GroupPayload | null>;
  enterInPrivateGroup: (entryCode: string, userId: number) => Promise<Group>;
}

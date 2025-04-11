import type { Group } from '@prisma/client';
import type { IGroupContract } from '../contract/group-contract';
import type { CreateGroupDto } from '../dto/group-dto';

export class InMemoryGroupRepository implements IGroupContract {
  public groups: Group[] = [];

  public usersInGroup: {
    id: number;
    created_at: Date;
    updated_at: Date;
    user_id: number;
    group_id: number;
  }[] = [];

  private usersInGroupCounter = 1;

  async createGroup({
    name,
    subject,
    description,
    privacy,
    userId,
  }: CreateGroupDto): Promise<Group> {
    const group = {
      id: this.groups.length + 1,
      name,
      subject,
      description,
      privacy,
      user_id: userId,
      user_count: 0,
      user_limit: 10,
      created_at: new Date(),
      updated_at: new Date(),
    } as Group;

    this.groups.push(group);
    return group;
  }

  async getGroupsCreatedByUserId(userId: number): Promise<Group[] | null> {
    const groups = this.groups.filter((group) => group.user_id === userId);
    return groups.length > 0 ? groups : null;
  }

  async enterInGroup(groupId: number, userId: number): Promise<Group> {
    const group = this.groups.find((group) => group.id === groupId);

    if (!group) {
      throw new Error('Group not found');
    }

    group.user_count = (group.user_count || 0) + 1;
    group.updated_at = new Date();

    this.usersInGroup.push({
      id: this.usersInGroupCounter++,
      created_at: new Date(),
      updated_at: new Date(),
      user_id: userId,
      group_id: groupId,
    });

    return group;
  }

  async getGroupById(groupId: number): Promise<
    | (Group & {
        Users_In_Group: {
          id: number;
          created_at: Date;
          updated_at: Date;
          user_id: number;
          group_id: number;
        }[];
      })
    | null
  > {
    const group = this.groups.find((group) => group.id === groupId);

    if (!group) {
      return null;
    }

    const usersInGroup = this.usersInGroup.filter(
      (entry) => entry.group_id === groupId,
    );

    return {
      ...group,
      Users_In_Group: usersInGroup,
    };
  }

  async getPublicGroupsWithVacancies(): Promise<Group[]> {
    const groupsWithVacancies = this.groups.filter(
      (group) =>
        group.privacy === 'PUBLIC' &&
        (group.user_count || 0) < (group.user_limit || 10),
    );

    return groupsWithVacancies;
  }
}

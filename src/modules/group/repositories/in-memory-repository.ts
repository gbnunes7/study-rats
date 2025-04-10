import type { Group } from '@prisma/client';
import type { IGroupContract } from '../contract/group-contract';
import type { CreateGroupDto } from '../dto/group-dto';

export class InMemoryGroupRepository implements IGroupContract {
  public group: Group[] = [];

  async createGroup({
    name,
    subject,
    description,
    privacy,
    userId,
  }: CreateGroupDto): Promise<Group> {
    const group = {
      id: this.group.length + 1,
      name,
      subject,
      description,
      privacy,
      user_id: userId,
    } as Group;

    this.group.push(group);
    return group;
  }

  async getGroupsCreatedByUserId(userId: number): Promise<Group[] | null> {
    const groups = this.group.filter((group) => group.user_id === userId);

    return groups.length > 0 ? groups : null;
  }
}

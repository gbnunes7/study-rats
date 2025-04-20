import type { Message, Privacy, Subject } from '@prisma/client';
import type { IMessageContract } from '../contract/message-contract';
import type { GroupPayload } from '../../group/types/group-payload';

class InMemoryMessageRepository implements IMessageContract {
  public messages: Message[] = [];

  async createMessage({
    content,
    userId,
    groupId,
  }: {
    content: string;
    userId: number;
    groupId: number;
  }): Promise<Message> {
    const message = {
      id: this.messages.length + 1,
      content,
      user_id: userId,
      group_id: groupId,
      created_at: new Date(),
      updated_at: new Date(),
    } as Message;

    this.messages.push(message);
    return message;
  }

  async getMessagesByGroupId(groupId: number): Promise<Message[]> {
    return this.messages.filter((message) => message.group_id === groupId);
  }

  async getGroupById(groupId: number): Promise<GroupPayload | null> {
    const groupMessages = this.messages.filter((m) => m.group_id === groupId);
    if (groupMessages.length === 0) return null;

    const fakeGroup = {
      id: groupId,
      name: `Group ${groupId}`,
      description: null,
      subject: 'JAVASCRIPT' as Subject,
      entry_code: null,
      user_limit: 5,
      user_count: 1,
      privacy: 'PRIVATE' as Privacy,
      created_at: new Date(),
      updated_at: new Date(),
      user_id: 1,
      Users_In_Group: [
        {
          id: 1,
          user_id: groupMessages[0].user_id,
          group_id: groupId,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
    };

    return fakeGroup;
  }
}

export { InMemoryMessageRepository };

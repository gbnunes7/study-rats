import type { Message } from '@prisma/client';
import type { CreateMessageDto } from '../dto/message-dto';
import type { GroupPayload } from '../../group/types/group-payload';

export interface IMessageContract {
  createMessage: ({
    content,
    userId,
    groupId,
  }: CreateMessageDto) => Promise<Message>;

  getMessagesByGroupId: (groupId: number) => Promise<Message[]>;
  getGroupById: (groupId: number) => Promise<GroupPayload | null>;
}

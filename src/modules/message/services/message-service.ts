import type { Message } from '@prisma/client';
import type { CreateMessageDto } from '../dto/message-dto';
import type { MessageRepository } from '../repositories/prisma-repository';
import { GroupNotFoundError } from '../../group/services/errors/group-not-found-error';
import type { IMessageContract } from '../contract/message-contract';

class MessageService {
  constructor(private messageRepository: IMessageContract) {}

  async createMessage({
    content,
    userId,
    groupId,
  }: CreateMessageDto): Promise<Message> {
    if (content.length < 1) {
      throw new Error('Message content cannot be empty');
    }

    if (content.length > 500) {
      throw new Error('Message content cannot exceed 500 characters');
    }

    const group = await this.messageRepository.getGroupById(groupId);

    if (!group) {
      throw new GroupNotFoundError();
    }

    group?.Users_In_Group.some((user) => {
      if (user.user_id !== userId) {
        throw new Error('User is not a member of the group');
      }
    });

    const message = await this.messageRepository.createMessage({
      content,
      userId,
      groupId,
    });
    if (!message) {
      throw new GroupNotFoundError();
    }

    return message;
  }

  async getMessagesByGroupId(groupId: number): Promise<Message[]> {
    const messages = await this.messageRepository.getMessagesByGroupId(groupId);

    return messages;
  }
}

export { MessageService };

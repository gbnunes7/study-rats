import type { Message, PrismaClient } from '@prisma/client';
import type { IMessageContract } from '../contract/message-contract';
import type { CreateMessageDto } from '../dto/message-dto';
import type { GroupPayload } from '../../group/types/group-payload';

class MessageRepository implements IMessageContract {
  constructor(private prismaClient: PrismaClient) {}

  async createMessage({
    content,
    userId,
    groupId,
  }: CreateMessageDto): Promise<Message> {
    return await this.prismaClient.message.create({
      data: {
        content,
        user_id: userId,
        group_id: groupId,
      },
    });
  }

  async getMessagesByGroupId(groupId: number): Promise<Message[]> {
    return await this.prismaClient.message.findMany({
      where: {
        group_id: groupId,
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getGroupById(groupId: number): Promise<GroupPayload | null> {
    return await this.prismaClient.group.findFirst({
      where: {
        id: groupId,
      },
      include: {
        Users_In_Group: true,
      },
    });
  }
}

export { MessageRepository };

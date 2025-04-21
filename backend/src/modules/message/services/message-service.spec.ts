import { describe, it, expect, beforeEach } from 'vitest';
import { MessageService } from './message-service';
import { InMemoryMessageRepository } from '../repositories/in-memory-repository';
import { GroupNotFoundError } from '../../group/services/errors/group-not-found-error';

let messageRepository: InMemoryMessageRepository;
let sut: MessageService;

describe('Message Service', () => {
  beforeEach(() => {
    messageRepository = new InMemoryMessageRepository();
    sut = new MessageService(messageRepository);
  });

  it('should create a message if content is valid and user is in group', async () => {
    const userId = 1;
    const groupId = 10;
    const content = 'Mensagem válida';

    await messageRepository.createMessage({
      userId,
      groupId,
      content: 'msg init',
    });

    const message = await sut.createMessage({ userId, groupId, content });

    expect(message).toBeDefined();
    expect(message.content).toBe(content);
    expect(message.group_id).toBe(groupId);
    expect(message.user_id).toBe(userId);
  });

  it('should throw if message content is empty', async () => {
    await expect(() =>
      sut.createMessage({ userId: 1, groupId: 1, content: '' }),
    ).rejects.toThrow('Message content cannot be empty');
  });

  it('should throw if message content exceeds 500 characters', async () => {
    const longMessage = 'a'.repeat(501);

    await expect(() =>
      sut.createMessage({ userId: 1, groupId: 1, content: longMessage }),
    ).rejects.toThrow('Message content cannot exceed 500 characters');
  });

  it('should throw if user is not part of group', async () => {
    const userId = 2;
    const groupId = 5;

    await messageRepository.createMessage({
      userId: 1,
      groupId,
      content: 'init',
    });

    await expect(() =>
      sut.createMessage({ userId, groupId, content: 'oi' }),
    ).rejects.toThrow('User is not a member of the group');
  });

  it('should throw GroupNotFoundError if group is invalid', async () => {
    await expect(() =>
      sut.createMessage({ userId: 1, groupId: 999, content: 'teste' }),
    ).rejects.toThrow(GroupNotFoundError);
  });

  it('should return all messages by group id', async () => {
    const groupId = 3;

    await messageRepository.createMessage({
      userId: 1,
      groupId,
      content: 'Primeira',
    });
    await messageRepository.createMessage({
      userId: 1,
      groupId,
      content: 'Segunda',
    });

    const messages = await sut.getMessagesByGroupId(groupId);

    expect(messages).toHaveLength(2);
    expect(messages.map((m) => m.content)).toEqual(['Primeira', 'Segunda']);
  });
});

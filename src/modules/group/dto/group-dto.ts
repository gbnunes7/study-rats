import type { Privacy, Subject } from '@prisma/client';

export type CreateGroupDto = {
  name: string;
  description?: string;
  subject: Subject;

  privacy?: Privacy;
  userId: number;
};

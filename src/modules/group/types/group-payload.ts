import type { Prisma } from '@prisma/client';

export type GroupPayload = Prisma.GroupGetPayload<{
  include: { Users_In_Group: true };
}>;

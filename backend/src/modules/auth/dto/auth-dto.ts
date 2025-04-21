import type { Subject } from "@prisma/client";

export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  subjectInterest: Subject[];
  description?: string;
};

export type CreateSessionDto = {
  email: string;
  password: string;
};

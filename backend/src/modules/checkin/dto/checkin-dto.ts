export type CreateCheckinDto = {
  userId: number;
  title: string;
  description: string;
  studyTime: number;
  commits: number;
  groupId: number;
  imageUrl?: string;
  file?: Express.Multer.File;
};

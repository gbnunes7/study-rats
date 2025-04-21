import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { s3Client } from '../../../lib/s3-aws/s3-aws-client';
import { env } from '../../../lib/env/env-validator';

class UploadCheckinImage {
  constructor(
    private readonly file: Express.Multer.File,
    private readonly folder: string = 'checkins',
  ) {}

  async execute(): Promise<string> {
    const key = `${this.folder}/${uuidv4()}-${this.file.originalname}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
        Body: this.file.buffer,
        ContentType: this.file.mimetype,
      }),
    );

    const imageUrl = `https://${env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
    return imageUrl;
  }
}
export { UploadCheckinImage };

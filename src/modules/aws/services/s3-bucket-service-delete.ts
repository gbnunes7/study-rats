import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../../../lib/env/env-validator';
import { s3Client } from '../../../lib/s3-aws/s3-aws-client';

class DeleteImageFromBucket {
  constructor(private imageUrl: string) {}

  async execute(): Promise<void> {
    const bucketName = env.S3_BUCKET_NAME;
    const url = new URL(this.imageUrl);
    const key = decodeURIComponent(
      url.pathname.replace(`/${bucketName}/`, '').replace(/^\/+/, ''),
    );

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
    );
  }
}

export { DeleteImageFromBucket };
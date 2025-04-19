import { S3Client } from '@aws-sdk/client-s3';
import { env } from '../env/env-validator';

const s3Client = new S3Client({
  region: env.S3_AWS_REGION,
  credentials: {
    accessKeyId: env.S3_AWS_ACCESS_KEY,
    secretAccessKey: env.S3_AWS_SECRET_KEY,
  },
});

export { s3Client };

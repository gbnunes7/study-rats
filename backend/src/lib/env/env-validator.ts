import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  POSTGRESQL_PASSWORD: z.string(),
  POSTGRESQL_HOST: z.string(),
  POSTGRESQL_USERNAME: z.string(),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  S3_AWS_ACCESS_KEY: z.string(),
  S3_AWS_SECRET_KEY: z.string(),
  S3_AWS_REGION: z.string(),
  S3_BUCKET_NAME: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = _env.data;

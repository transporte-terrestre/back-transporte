import type { Config } from 'drizzle-kit';
import { dbConfig } from '@db/config.db';

export default {
  schema: './src/db/tables/*',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: dbConfig,
} satisfies Config;

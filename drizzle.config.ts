import type { Config } from "drizzle-kit";
import { dbConfig } from "@db/config.db";

export default {
  schema: "./src/models/*",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: dbConfig,
} satisfies Config;

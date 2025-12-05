import { execSync } from "child_process";
import { Client } from "pg";
import { dbConfig } from "./config.db";

async function createDatabase() {
  const { database, ...postgresConfig } = dbConfig;

  // Connect to default 'postgres' database to check/create the target database
  const client = new Client({
    ...postgresConfig,
    database: "postgres",
  });

  try {
    await client.connect();

    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [database]
    );

    if (result.rowCount === 0) {
      console.log(`Database '${database}' does not exist. Creating...`);
      await client.query(`CREATE DATABASE "${database}"`);
      console.log(`✅ Database '${database}' created successfully.`);
    } else {
      console.log(`Database '${database}' already exists.`);
    }
  } catch (error) {
    console.error("❌ Error checking/creating database:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

async function createTables() {
  try {
    await createDatabase();
    execSync("npx drizzle-kit push --config=drizzle.config.ts", {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    console.log("✅ Tablas creadas exitosamente desde los modelos");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al crear las tablas");
    process.exit(1);
  }
}

createTables();

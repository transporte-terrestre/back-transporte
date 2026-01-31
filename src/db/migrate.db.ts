import { config } from 'dotenv';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.PROD === 'true',
};

async function migrate() {
  const pool = new Pool(dbConfig);
  const client = await pool.connect();

  try {
    console.log('🔄 Iniciando migraciones...');

    // Crear tabla de migraciones si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS migraciones_aplicadas (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL UNIQUE,
        aplicado_en TIMESTAMP DEFAULT NOW()
      );
    `);

    // Leer archivos de migración
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    console.log(`📁 Encontradas ${files.length} migraciones`);

    for (const file of files) {
      // Verificar si ya fue aplicada
      const { rows } = await client.query('SELECT 1 FROM migraciones_aplicadas WHERE nombre = $1', [file]);

      if (rows.length > 0) {
        console.log(`⏭️  Saltando (ya aplicada): ${file}`);
        continue;
      }

      // Leer y ejecutar migración
      const sqlPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(sqlPath, 'utf-8');

      console.log(`🚀 Aplicando: ${file}`);
      await client.query('BEGIN');

      try {
        await client.query(sql);
        await client.query('INSERT INTO migraciones_aplicadas (nombre) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`✅ Completada: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    }

    console.log('✅ Todas las migraciones completadas');
  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();

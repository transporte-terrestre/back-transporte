import { spawn } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config();

const dbVersion = process.env.DB_VERSION || 'version_001';
const backupDir = path.join(process.cwd(), 'src', 'db', 'backups');

const getPreviousVersion = (current: string): string => {
  const match = current.match(/version_(\d+)/);
  if (!match) return 'version_000';
  const num = parseInt(match[1], 10);
  const prevNum = num > 0 ? num - 1 : 0;
  return `version_${String(prevNum).padStart(3, '0')}`;
};

const runRestore = async () => {
  const { DB_HOST, DB_USER, DB_NAME, DB_CONTAINER_NAME, DB_PASSWORD } = process.env;

  // 🛡️ SECURITY CHECK: Only allow on localhost
  const isLocalhost = DB_HOST === 'localhost' || DB_HOST === '127.0.0.1' || DB_HOST === '::1';
  if (!isLocalhost) {
    console.error('❌ Error de Seguridad: Solo se puede ejecutar restore en localhost.');
    console.error(`   Host detectado: ${DB_HOST}`);
    console.error('   Esta operación es destructiva y borraría toda la base de datos.');
    process.exit(1);
  }

  const prevVersion = getPreviousVersion(dbVersion);
  const fileName = `${prevVersion}.sql`;
  const filePath = path.join(backupDir, fileName);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ No se encontró el archivo de backup: ${filePath}`);
    process.exit(1);
  }

  if (!DB_CONTAINER_NAME) {
    console.error('❌ Error: Falta DB_CONTAINER_NAME en el archivo .env');
    process.exit(1);
  }

  console.log(`♻️ Restaurando en Docker (${DB_CONTAINER_NAME}) desde: ${fileName}`);
  console.log(`🧹 Limpiando base de datos completa (DROP SCHEMA public CASCADE)...`);

  // Paso 1: Limpiar BD (Reset total)
  const resetSql = 'DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO public;';

  const resetArgs = ['exec', '-i', DB_CONTAINER_NAME, 'psql', '-U', DB_USER!, '-d', DB_NAME!, '-c', resetSql];

  if (DB_PASSWORD) {
    resetArgs.splice(1, 0, '-e', `PGPASSWORD=${DB_PASSWORD}`);
  }

  const resetProc = spawn('docker', resetArgs);

  resetProc.stderr.on('data', (d) => {
    // Ignorar warnings irrelevantes durante el drop si no existe
    // console.error(`[Reset Info]: ${d}`)
  });

  resetProc.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Error al limpiar BD. Código: ${code}`);
      console.error('Abortando restauración.');
      process.exit(1);
    }

    console.log('✅ Base de datos limpiada correctamente.');
    console.log(`⏳ Aplicando backup...`);

    // Paso 2: Restaurar
    const restoreArgs = ['exec', '-i', DB_CONTAINER_NAME, 'psql', '-U', DB_USER!, DB_NAME!];
    if (DB_PASSWORD) {
      restoreArgs.splice(1, 0, '-e', `PGPASSWORD=${DB_PASSWORD}`);
    }

    const restoreChild = spawn('docker', restoreArgs);
    const fileStream = fs.createReadStream(filePath);

    fileStream.pipe(restoreChild.stdin);

    restoreChild.stderr.on('data', (data) => {
      const msg = data.toString();
      if (!msg.startsWith('NOTICE') && !msg.includes('extension "plpgsql" already exists')) {
        console.log(`psql: ${msg}`);
      }
    });

    restoreChild.on('close', (rCode) => {
      if (rCode === 0) {
        console.log(`✅ Restauración completada exitosamente.`);
      } else {
        console.error(`❌ Error en restauración. Código: ${rCode}`);
      }
    });
  });
};

runRestore();

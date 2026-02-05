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

const runRestore = () => {
  const prevVersion = getPreviousVersion(dbVersion);
  const fileName = `${prevVersion}.sql`;
  const filePath = path.join(backupDir, fileName);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ No se encontró el archivo de backup: ${filePath}`);
    process.exit(1);
  }

  const { DB_USER, DB_NAME, DB_CONTAINER_NAME, DB_PASSWORD } = process.env;

  if (!DB_CONTAINER_NAME) {
    console.error('❌ Error: Falta DB_CONTAINER_NAME en el archivo .env');
    process.exit(1);
  }

  console.log(`♻️ Restaurando en Docker (${DB_CONTAINER_NAME}) desde: ${fileName}`);

  // docker exec -i [container] psql -U [user] [db]
  const args = ['exec', '-i', DB_CONTAINER_NAME, 'psql', '-U', DB_USER!, DB_NAME!];

  if (DB_PASSWORD) {
    args.splice(1, 0, '-e', `PGPASSWORD=${DB_PASSWORD}`);
  }

  const child = spawn('docker', args);
  const fileStream = fs.createReadStream(filePath);

  fileStream.pipe(child.stdin);

  child.stderr.on('data', (data) => {
    // psql output usually goes to stdout but errors/notices to stderr
    const msg = data.toString();
    if (!msg.startsWith('NOTICE')) {
      console.log(`psql: ${msg}`);
    }
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log(`✅ Restauración completada exitosamente.`);
    } else {
      console.error(`❌ Falló con código ${code}.`);
    }
  });

  child.on('error', (err) => {
    console.error('❌ Error al ejecutar docker:', err.message);
  });
};

runRestore();

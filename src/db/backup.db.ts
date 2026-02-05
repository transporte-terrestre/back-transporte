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

const runBackup = () => {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const prevVersion = getPreviousVersion(dbVersion);
  const fileName = `${prevVersion}.sql`;
  const filePath = path.join(backupDir, fileName);

  const { DB_USER, DB_NAME, DB_CONTAINER_NAME } = process.env;

  if (!DB_CONTAINER_NAME) {
    console.error('❌ Error: Falta DB_CONTAINER_NAME en el archivo .env');
    console.error('💡 Agrega: DB_CONTAINER_NAME=nombre_de_tu_contenedor');
    process.exit(1);
  }

  console.log(`📦 Generando backup Docker (${DB_CONTAINER_NAME}): ${fileName}`);

  // docker exec -i [container] pg_dump -U [user] --clean --if-exists [db]
  const args = ['exec', '-i', DB_CONTAINER_NAME, 'pg_dump', '-U', DB_USER!, '--clean', '--if-exists', DB_NAME!];

  const dbPassword = process.env.DB_PASSWORD;
  if (dbPassword) {
    args.splice(1, 0, '-e', `PGPASSWORD=${dbPassword}`);
  }

  console.log(`⏳ Ejecutando: docker ${args.join(' ')} > ${fileName}`);

  const child = spawn('docker', args);
  const fileStream = fs.createWriteStream(filePath);

  child.stdout.pipe(fileStream);

  child.stderr.on('data', (data) => {
    // pg_dump warnings
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log(`✅ Backup generado exitosamente en: ${filePath}`);
    } else {
      console.error(`❌ Falló con código ${code}. Verifica que Docker esté corriendo y el nombre del contenedor sea correcto.`);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // Borrar archivo incompleto
    }
  });

  child.on('error', (err) => {
    console.error('❌ Error al ejecutar docker:', err.message);
  });
};

runBackup();

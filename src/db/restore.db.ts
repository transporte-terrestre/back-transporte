import { spawn } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as readline from 'readline';

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

// Función para pedir confirmación
const askConfirmation = (query: string): Promise<boolean> => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'si' || answer.toLowerCase() === 'y');
    });
  });
};

const runRestore = async () => {
  const { DB_HOST, DB_USER, DB_NAME, DB_CONTAINER_NAME, DB_PASSWORD, DB_PORT } = process.env;

  const isLocalhost = DB_HOST === 'localhost' || DB_HOST === '127.0.0.1' || DB_HOST === '::1';

  // ⚠️ ADVERTENCIA CRÍTICA SI ES REMOTO
  if (!isLocalhost) {
    console.warn('\n⚠️  ¡CUIDADO! ESTÁS APUNTANDO A UN SERVIDOR REMOTO:', DB_HOST);
    console.warn('⚠️  ESTO BORRARÁ TODA LA BASE DE DATOS REMOTA.');
    const confirmed = await askConfirmation('¿Estás 100% seguro de continuar? (si/no): ');
    if (!confirmed) {
      console.log('Cancelado por el usuario.');
      process.exit(0);
    }
  }

  const prevVersion = getPreviousVersion(dbVersion);
  const fileName = `${prevVersion}.sql`;
  const filePath = path.join(backupDir, fileName);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ No se encontró el archivo de backup: ${filePath}`);
    process.exit(1);
  }

  console.log(`♻️  Restaurando hacia: ${DB_HOST} (Base de datos: ${DB_NAME})`);
  
  // Definimos la estrategia de comando
  let baseCommand = 'docker';
  let cleanArgs: string[] = [];
  let restoreArgs: string[] = [];
  const port = DB_PORT || '5432';

  if (isLocalhost) {
    // MODO LOCAL: Usamos exec sobre el contenedor existente
    console.log(`Modo Local: Usando contenedor ${DB_CONTAINER_NAME}`);
    
    // Comando para limpiar
    cleanArgs = ['exec', '-i', DB_CONTAINER_NAME!, 'psql', '-U', DB_USER!, '-d', DB_NAME!, '-c', 'DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO public;'];
    
    // Comando para restaurar
    restoreArgs = ['exec', '-i', DB_CONTAINER_NAME!, 'psql', '-U', DB_USER!, DB_NAME!];

  } else {
    // MODO REMOTO: Usamos un contenedor efímero como cliente
    console.log(`Modo Nube: Lanzando cliente Docker temporal hacia ${DB_HOST}`);

    const commonDockerFlags = ['run', '--rm', '-i', '-e', `PGPASSWORD=${DB_PASSWORD}`, 'postgres', 'psql', '-h', DB_HOST!, '-p', port, '-U', DB_USER!];

    // Comando para limpiar
    cleanArgs = [...commonDockerFlags, '-d', DB_NAME!, '-c', 'DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO public;'];

    // Comando para restaurar
    restoreArgs = [...commonDockerFlags, DB_NAME!];
  }

  // --- EJECUCIÓN ---

  // 1. Limpieza
  console.log(`🧹 Limpiando esquema...`);
  const resetProc = spawn(baseCommand, cleanArgs, { 
    env: { ...process.env, PGPASSWORD: DB_PASSWORD }
  });

  // Manejo de errores del reset...
  resetProc.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Error al limpiar BD. Código: ${code}`);
      process.exit(1);
    }

    console.log('✅ Base de datos limpiada.');
    console.log(`⏳ Aplicando backup ${fileName}...`);

    // 2. Restauración
    const restoreChild = spawn(baseCommand, restoreArgs, {
        env: { ...process.env, PGPASSWORD: DB_PASSWORD }
    });
    
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
        console.log(`✅ Restauración COMPLETADA en ${DB_HOST}.`);
      } else {
        console.error(`❌ Error en restauración. Código: ${rCode}`);
      }
    });
  });
};

runRestore();
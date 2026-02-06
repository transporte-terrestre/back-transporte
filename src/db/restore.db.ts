import { spawn } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as readline from 'readline';

dotenv.config();

const dbVersion = process.env.DB_VERSION;
const backupDir = path.join(process.cwd(), 'src', 'db', 'backups');

const getPreviousVersion = (current: string): string => {
  const match = current.match(/version_(\d+)/);
  if (!match) return 'version_000';
  const num = parseInt(match[1], 10);
  const prevNum = num > 0 ? num - 1 : 0;
  return `version_${String(prevNum).padStart(3, '0')}`;
};

// Función para pedir confirmación manual en consola
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

  // 1. Detección de entorno
  const isLocalhost = DB_HOST === 'localhost' || DB_HOST === '127.0.0.1' || DB_HOST === '::1';

  // 2. Alerta de Seguridad (Solo si es remoto)
  if (!isLocalhost) {
    console.warn('\n⚠️  ¡CUIDADO! ESTÁS APUNTANDO A UN SERVIDOR REMOTO:', DB_HOST);
    console.warn('⚠️  ESTO BORRARÁ TODA LA BASE DE DATOS REMOTA PARA RESTAURAR EL BACKUP.');
    const confirmed = await askConfirmation('¿Estás 100% seguro de continuar? (si/no): ');
    if (!confirmed) {
      console.log('🛑 Operación cancelada por el usuario.');
      process.exit(0);
    }
  }

  // 3. Preparar archivo de backup
  const prevVersion = getPreviousVersion(dbVersion);
  const fileName = `${prevVersion}.sql`;
  const filePath = path.join(backupDir, fileName);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ No se encontró el archivo de backup: ${filePath}`);
    process.exit(1);
  }

  console.log(`♻️  Restaurando hacia: ${DB_HOST} (Base de datos: ${DB_NAME})`);
  
  // 4. Configurar comandos según el entorno
  let baseCommand = 'docker';
  let cleanArgs: string[] = [];
  let restoreArgs: string[] = [];
  const port = DB_PORT || '5432';

  if (isLocalhost) {
    // === MODO LOCAL (Docker Exec) ===
    console.log(`🖥️  Modo Local: Inyectando directamente en contenedor ${DB_CONTAINER_NAME}`);
    
    if (!DB_CONTAINER_NAME) {
        console.error('❌ Error: DB_CONTAINER_NAME es requerido en local.');
        process.exit(1);
    }

    // Limpiar
    cleanArgs = ['exec', '-i', DB_CONTAINER_NAME, 'psql', '-U', DB_USER!, '-d', DB_NAME!, '-c', 'DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO public;'];
    
    // Restaurar (Directo)
    restoreArgs = ['exec', '-i', DB_CONTAINER_NAME, 'psql', '-U', DB_USER!, DB_NAME!];

  } else {
    // === MODO NUBE (Docker Run + Filtro SED) ===
    console.log(`☁️  Modo Nube: Usando cliente temporal hacia ${DB_HOST}`);
    console.log(`ℹ️  Activando filtro para eliminar "OWNER TO admin" (compatibilidad Azure)...`);

    const commonDockerFlags = ['run', '--rm', '-i', '-e', `PGPASSWORD=${DB_PASSWORD}`, 'postgres'];

    // Limpiar (Conexión psql normal desde contenedor efímero)
    cleanArgs = [
      ...commonDockerFlags,
      'psql', '-h', DB_HOST!, '-p', port, '-U', DB_USER!, '-d', DB_NAME!, 
      '-c', 'DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO public;'
    ];

    // Restaurar (Con tubería Bash para SED)
    // Explicación: El stream de Node entra a Docker -> Bash -> sed (quita OWNER) -> psql (inserta)
    restoreArgs = [
      ...commonDockerFlags,
      '/bin/bash', '-c', 
      `sed '/OWNER TO/d' | psql -h ${DB_HOST} -p ${port} -U ${DB_USER} ${DB_NAME}`
    ];
  }

  // --- EJECUCIÓN ---

  // PASO A: Limpieza
  console.log(`🧹 Limpiando esquema 'public'...`);
  const resetProc = spawn(baseCommand, cleanArgs, { 
    env: { ...process.env, PGPASSWORD: DB_PASSWORD }
  });

  resetProc.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Error al limpiar BD. Código de salida: ${code}`);
      console.error('Verifica tus credenciales o conexión a internet.');
      process.exit(1);
    }

    console.log('✅ Base de datos limpiada correctamente.');
    console.log(`⏳ Aplicando backup: ${fileName}...`);

    // PASO B: Restauración
    const restoreChild = spawn(baseCommand, restoreArgs, {
        env: { ...process.env, PGPASSWORD: DB_PASSWORD }
    });
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(restoreChild.stdin);

    restoreChild.stderr.on('data', (data) => {
        const msg = data.toString();
        // Ignorar mensajes informativos o advertencias de extensiones
        if (!msg.startsWith('NOTICE') && !msg.includes('extension "plpgsql" already exists')) {
            // Si es un error real, lo mostramos
            console.log(`psql: ${msg}`);
        }
    });

    restoreChild.on('close', (rCode) => {
      if (rCode === 0) {
        console.log(`\n✨ ¡ÉXITO! Restauración completada en ${DB_HOST}.`);
      } else {
        console.error(`\n❌ La restauración finalizó con código de error: ${rCode}`);
        console.error('Nota: Si los errores son de permisos, verifica si el filtro SED funcionó correctamente.');
      }
    });
  });
};

runRestore();
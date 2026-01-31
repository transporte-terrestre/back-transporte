import { database } from '@db/connection.db';
import { usuarioDocumentos } from '@db/tables/usuario-documento.table';
import { Usuario } from '@db/tables/usuario.table';
import { getDate } from '@function/date.function';

const DEFAULT_PDF_URL = 'https://res.cloudinary.com/dm0qhq2rk/image/upload/v1766044501/mantenimientos/Ejemplo%20de%20certificado_1766044500270.pdf';

// Helper to format Date to YYYY-MM-DD string
const formatDate = (date: Date): string => date.toISOString().split('T')[0];

export async function seedUsuarioDocumentos(usuariosData: Usuario[]) {
  console.log('🌱 Seeding user documents...');

  if (usuariosData.length === 0) {
    console.log('⚠️ Skipping user documents (no users)');
    return;
  }

  const documentosData: Array<{
    usuarioId: number;
    tipo: 'dni' | 'seguro_vida_ley' | 'sctr' | 'examen_medico' | 'induccion_general';
    nombre: string;
    url: string;
    fechaExpiracion?: string;
    fechaEmision?: string;
  }> = [];

  // Track documents expiring soon (allocate ~2 for usuarios)
  let expiringCount = 0;
  const maxExpiringSoon = 2;

  for (let i = 0; i < usuariosData.length; i++) {
    const usuario = usuariosData[i];

    // DNI - No expiration
    documentosData.push({
      usuarioId: usuario.id,
      tipo: 'dni',
      nombre: `DNI_${usuario.nombreCompleto}`,
      url: DEFAULT_PDF_URL,
      fechaEmision: formatDate(getDate(-1000)),
    });

    // Seguro Vida Ley - some expiring soon
    let seguroOffset: number;
    if (expiringCount < maxExpiringSoon && i < 2) {
      seguroOffset = i + 5; // 5-6 days from now
      expiringCount++;
    } else {
      seguroOffset = 60 + i * 8;
    }
    documentosData.push({
      usuarioId: usuario.id,
      tipo: 'seguro_vida_ley',
      nombre: `Seguro_Vida_Ley_${usuario.nombreCompleto}`,
      url: DEFAULT_PDF_URL,
      fechaEmision: formatDate(getDate(-180)),
      fechaExpiracion: formatDate(getDate(seguroOffset)),
    });

    // SCTR - all valid
    documentosData.push({
      usuarioId: usuario.id,
      tipo: 'sctr',
      nombre: `SCTR_${usuario.nombreCompleto}`,
      url: DEFAULT_PDF_URL,
      fechaEmision: formatDate(getDate(-100)),
      fechaExpiracion: formatDate(getDate(45 + i * 6)),
    });

    // Examen Médico - all valid
    if (i < 8) {
      documentosData.push({
        usuarioId: usuario.id,
        tipo: 'examen_medico',
        nombre: `Examen_Medico_${usuario.nombreCompleto}`,
        url: DEFAULT_PDF_URL,
        fechaEmision: formatDate(getDate(-300)),
        fechaExpiracion: formatDate(getDate(90 + i * 15)),
      });
    }

    // Inducción General - all valid
    if (i < 6) {
      documentosData.push({
        usuarioId: usuario.id,
        tipo: 'induccion_general',
        nombre: `Induccion_General_${usuario.nombreCompleto}`,
        url: DEFAULT_PDF_URL,
        fechaEmision: formatDate(getDate(-365)),
        fechaExpiracion: formatDate(getDate(120 + i * 20)),
      });
    }
  }

  await database.insert(usuarioDocumentos).values(documentosData);
  console.log(`✅ ${documentosData.length} user documents inserted (${expiringCount} expiring soon)`);
}

import { database } from '@db/connection.db';
import { conductorDocumentos } from '@db/tables/conductor-documento.table';
import { Conductor } from '@db/tables/conductor.table';
import { getDate } from '@function/date.function';

const DEFAULT_PDF_URL = 'https://res.cloudinary.com/dm0qhq2rk/image/upload/v1766044501/mantenimientos/Ejemplo%20de%20certificado_1766044500270.pdf';

// Helper to format Date to YYYY-MM-DD string
const formatDate = (date: Date): string => date.toISOString().split('T')[0];

export async function seedConductorDocumentos(conductoresData: Conductor[]) {
  console.log('🌱 Seeding driver documents...');

  if (conductoresData.length === 0) {
    console.log('⚠️ Skipping driver documents (no drivers)');
    return;
  }

  const documentosData: Array<{
    conductorId: number;
    tipo:
      | 'dni'
      | 'licencia_mtc'
      | 'seguro_vida_ley'
      | 'sctr'
      | 'examen_medico'
      | 'psicosensometrico'
      | 'induccion_general'
      | 'manejo_defensivo'
      | 'licencia_interna';
    nombre: string;
    url: string;
    fechaExpiracion: string;
    fechaEmision: string;
  }> = [];

  // Track documents expiring soon (allocate ~5 for conductores)
  let expiringCount = 0;
  const maxExpiringSoon = 5;

  for (let i = 0; i < conductoresData.length; i++) {
    const conductor = conductoresData[i];

    // DNI - long validity
    documentosData.push({
      conductorId: conductor.id,
      tipo: 'dni',
      nombre: `DNI_${conductor.dni}`,
      url: DEFAULT_PDF_URL,
      fechaEmision: formatDate(getDate(-730)),
      fechaExpiracion: formatDate(getDate(365 * 3)), // 3 years
    });

    // Licencia MTC - some expiring soon
    let licenciaOffset: number;
    if (expiringCount < maxExpiringSoon && i < 5) {
      licenciaOffset = i + 2; // 2-6 days from now
      expiringCount++;
    } else {
      licenciaOffset = 45 + i * 10; // 45+ days
    }
    documentosData.push({
      conductorId: conductor.id,
      tipo: 'licencia_mtc',
      nombre: `Licencia_MTC_${conductor.numeroLicencia}`,
      url: DEFAULT_PDF_URL,
      fechaEmision: formatDate(getDate(-365)),
      fechaExpiracion: formatDate(getDate(licenciaOffset)),
    });

    // Seguro Vida Ley - all valid
    documentosData.push({
      conductorId: conductor.id,
      tipo: 'seguro_vida_ley',
      nombre: `Seguro_Vida_Ley_${conductor.nombreCompleto}`,
      url: DEFAULT_PDF_URL,
      fechaEmision: formatDate(getDate(-180)),
      fechaExpiracion: formatDate(getDate(60 + i * 5)),
    });

    // SCTR - all valid
    documentosData.push({
      conductorId: conductor.id,
      tipo: 'sctr',
      nombre: `SCTR_${conductor.nombreCompleto}`,
      url: DEFAULT_PDF_URL,
      fechaEmision: formatDate(getDate(-90)),
      fechaExpiracion: formatDate(getDate(45 + i * 5)),
    });

    // Examen Médico - all valid
    documentosData.push({
      conductorId: conductor.id,
      tipo: 'examen_medico',
      nombre: `Examen_Medico_${conductor.nombreCompleto}`,
      url: DEFAULT_PDF_URL,
      fechaEmision: formatDate(getDate(-330)),
      fechaExpiracion: formatDate(getDate(90 + i * 8)),
    });

    // Psicosensométrico
    if (i < 12) {
      documentosData.push({
        conductorId: conductor.id,
        tipo: 'psicosensometrico',
        nombre: `Psicosensometrico_${conductor.nombreCompleto}`,
        url: DEFAULT_PDF_URL,
        fechaEmision: formatDate(getDate(-700)),
        fechaExpiracion: formatDate(getDate(120 + i * 10)),
      });
    }

    // Inducción General
    if (i < 10) {
      documentosData.push({
        conductorId: conductor.id,
        tipo: 'induccion_general',
        nombre: `Induccion_General_${conductor.nombreCompleto}`,
        url: DEFAULT_PDF_URL,
        fechaEmision: formatDate(getDate(-365)),
        fechaExpiracion: formatDate(getDate(90 + i * 15)),
      });
    }

    // Manejo Defensivo
    if (i < 8) {
      documentosData.push({
        conductorId: conductor.id,
        tipo: 'manejo_defensivo',
        nombre: `Manejo_Defensivo_${conductor.nombreCompleto}`,
        url: DEFAULT_PDF_URL,
        fechaEmision: formatDate(getDate(-400)),
        fechaExpiracion: formatDate(getDate(100 + i * 20)),
      });
    }

    // Licencia Interna
    if (i < 6) {
      documentosData.push({
        conductorId: conductor.id,
        tipo: 'licencia_interna',
        nombre: `Licencia_Interna_${conductor.nombreCompleto}`,
        url: DEFAULT_PDF_URL,
        fechaEmision: formatDate(getDate(-350)),
        fechaExpiracion: formatDate(getDate(180 + i * 30)),
      });
    }
  }

  await database.insert(conductorDocumentos).values(documentosData);
  console.log(`✅ ${documentosData.length} driver documents inserted (${expiringCount} expiring soon)`);
}

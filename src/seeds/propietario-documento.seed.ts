import { database } from '@db/connection.db';
import { propietarioDocumentos } from '@db/tables/propietario-documento.table';
import { Propietario } from '@db/tables/propietario.table';
import { getDate } from '@function/date.function';

const DEFAULT_PDF_URL = 'https://res.cloudinary.com/dm0qhq2rk/image/upload/v1766044501/mantenimientos/Ejemplo%20de%20certificado_1766044500270.pdf';

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

export async function seedPropietarioDocumentos(propietariosData: Propietario[]) {
  console.log('🌱 Seeding propietario documents...');

  if (propietariosData.length === 0) {
    console.log('⚠️ Skipping propietario documents (no propietarios)');
    return;
  }

  const documentosData: any[] = [];

  for (let i = 0; i < propietariosData.length; i++) {
    const propietario = propietariosData[i];

    // DNI or RUC document
    documentosData.push({
      propietarioId: propietario.id,
      tipo: propietario.tipoDocumento === 'DNI' ? 'dni' : 'ruc',
      nombre: `DocumentoIdentidad_${propietario.nombreCompleto}`,
      url: DEFAULT_PDF_URL,
      fechaEmision: formatDate(getDate(-365)),
    });

    // Contrato
    documentosData.push({
      propietarioId: propietario.id,
      tipo: 'contrato',
      nombre: `Contrato_Adhesion_${propietario.nombreCompleto}`,
      url: DEFAULT_PDF_URL,
      fechaEmision: formatDate(getDate(-180)),
      fechaExpiracion: formatDate(getDate(180 + i * 30)),
    });
  }

  await database.insert(propietarioDocumentos).values(documentosData);
  console.log(`✅ ${documentosData.length} propietario documents inserted`);
}

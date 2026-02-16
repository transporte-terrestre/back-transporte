import { database } from '@db/connection.db';
import { vehiculoDocumentos } from '@db/tables/vehiculo-documento.table';
import { Vehiculo } from '@db/tables/vehiculo.table';
import { getDate } from '@function/date.function';

const DEFAULT_PDF_URL = 'https://res.cloudinary.com/dm0qhq2rk/image/upload/v1766044501/mantenimientos/Ejemplo%20de%20certificado_1766044500270.pdf';

// Helper to format Date to YYYY-MM-DD string
const formatDate = (date: Date): string => date.toISOString().split('T')[0];

export async function seedVehiculoDocumentos(vehiculosData: Vehiculo[]) {
  console.log('🌱 Seeding vehicle documents...');

  if (vehiculosData.length === 0) {
    console.log('⚠️ Skipping vehicle documents (no vehicles)');
    return;
  }

  const documentosData: Array<{
    vehiculoId: number;
    tipo:
      | 'tarjeta_propiedad'
      | 'tarjeta_unica_circulacion'
      | 'citv'
      | 'soat'
      | 'poliza'
      | 'certificado_operatividad_factura'
      | 'plan_mantenimiento_historico'
      | 'certificado_instalacion_gps'
      | 'certificado_valor_anadido'
      | 'constancia_gps'
      | 'certificado_extintores_hidrostatica'
      | 'certificado_norma_r66'
      | 'certificado_laminados_lunas'
      | 'certificado_carroceria'
      | 'certificado_caracteristicas_tecnicas'
      | 'certificado_adas'
      | 'revision_gps'
      | 'otros';
    nombre: string;
    url: string;
    fechaExpiracion?: string;
    fechaEmision?: string;
  }> = [];

  // Track documents expiring soon (allocate ~4 for vehiculos)
  let expiringCount = 0;
  const maxExpiringSoon = 4;

  for (let i = 0; i < vehiculosData.length; i++) {
    const vehiculo = vehiculosData[i];

    // Tarjeta de Propiedad - No expiration
    documentosData.push({
      vehiculoId: vehiculo.id,
      tipo: 'tarjeta_propiedad',
      nombre: `Tarjeta_Propiedad_${vehiculo.placa}`,
      url: DEFAULT_PDF_URL,
      fechaEmision: formatDate(getDate(-1000)),
    });

    // TUC - all valid
    documentosData.push({
      vehiculoId: vehiculo.id,
      tipo: 'tarjeta_unica_circulacion',
      nombre: `TUC_${vehiculo.placa}`,
      url: DEFAULT_PDF_URL,
      fechaEmision: formatDate(getDate(-350)),
      fechaExpiracion: formatDate(getDate(60 + i * 10)),
    });

    // CITV - some expiring soon
    let citvOffset: number;
    if (expiringCount < maxExpiringSoon && i < 4) {
      citvOffset = i + 3; // 3-6 days from now
      expiringCount++;
    } else {
      citvOffset = 45 + i * 8;
    }
    documentosData.push({
      vehiculoId: vehiculo.id,
      tipo: 'citv',
      nombre: `CITV_${vehiculo.placa}`,
      url: DEFAULT_PDF_URL,
      fechaEmision: formatDate(getDate(-180)),
      fechaExpiracion: formatDate(getDate(citvOffset)),
    });

    // SOAT - all valid
    documentosData.push({
      vehiculoId: vehiculo.id,
      tipo: 'soat',
      nombre: `SOAT_${vehiculo.placa}`,
      url: DEFAULT_PDF_URL,
      fechaEmision: formatDate(getDate(-300)),
      fechaExpiracion: formatDate(getDate(30 + i * 10)),
    });

    // Póliza - all valid
    documentosData.push({
      vehiculoId: vehiculo.id,
      tipo: 'poliza',
      nombre: `Poliza_Seguro_${vehiculo.placa}`,
      url: DEFAULT_PDF_URL,
      fechaEmision: formatDate(getDate(-350)),
      fechaExpiracion: formatDate(getDate(90 + i * 15)),
    });

    // Certificado GPS
    if (i < 12) {
      documentosData.push({
        vehiculoId: vehiculo.id,
        tipo: 'certificado_instalacion_gps',
        nombre: `Cert_GPS_${vehiculo.placa}`,
        url: DEFAULT_PDF_URL,
        fechaEmision: formatDate(getDate(-400)),
        fechaExpiracion: formatDate(getDate(120 + i * 10)),
      });

      documentosData.push({
        vehiculoId: vehiculo.id,
        tipo: 'constancia_gps',
        nombre: `Constancia_GPS_${vehiculo.placa}`,
        url: DEFAULT_PDF_URL,
        fechaEmision: formatDate(getDate(-200)),
        fechaExpiracion: formatDate(getDate(150 + i * 10)),
      });
    }

    // Certificado Extintores
    if (i < 10) {
      documentosData.push({
        vehiculoId: vehiculo.id,
        tipo: 'certificado_extintores_hidrostatica',
        nombre: `Cert_Extintores_${vehiculo.placa}`,
        url: DEFAULT_PDF_URL,
        fechaEmision: formatDate(getDate(-365)),
        fechaExpiracion: formatDate(getDate(90 + i * 12)),
      });
    }

    // Revisión GPS (Antes Certificado Tacos)
    if (i < 8) {
      documentosData.push({
        vehiculoId: vehiculo.id,
        tipo: 'revision_gps',
        nombre: `Revision_GPS_${vehiculo.placa}`,
        url: DEFAULT_PDF_URL,
        fechaEmision: formatDate(getDate(-300)),
        fechaExpiracion: formatDate(getDate(150 + i * 20)),
      });
    }

    // Certificado Carrocería
    if (i < 6) {
      documentosData.push({
        vehiculoId: vehiculo.id,
        tipo: 'certificado_carroceria',
        nombre: `Cert_Carroceria_${vehiculo.placa}`,
        url: DEFAULT_PDF_URL,
        fechaEmision: formatDate(getDate(-500)),
        fechaExpiracion: formatDate(getDate(180 + i * 20)),
      });
    }

    // Certificado ADAS - Modern vehicles
    if (i < 4 && vehiculo.anio >= 2020) {
      documentosData.push({
        vehiculoId: vehiculo.id,
        tipo: 'certificado_adas',
        nombre: `Cert_ADAS_${vehiculo.placa}`,
        url: DEFAULT_PDF_URL,
        fechaEmision: formatDate(getDate(-200)),
        fechaExpiracion: formatDate(getDate(200 + i * 30)),
      });
    }

    // Certificado Operatividad
    if (i < 10) {
      documentosData.push({
        vehiculoId: vehiculo.id,
        tipo: 'certificado_operatividad_factura',
        nombre: `Cert_Operatividad_${vehiculo.placa}`,
        url: DEFAULT_PDF_URL,
        fechaEmision: formatDate(getDate(-180)),
        fechaExpiracion: formatDate(getDate(120 + i * 15)),
      });
    }
  }

  await database.insert(vehiculoDocumentos).values(documentosData);
  console.log(`✅ ${documentosData.length} vehicle documents inserted (${expiringCount} expiring soon)`);
}

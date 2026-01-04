import { database } from '@db/connection.db';
import { proveedorDocumentos } from '@model/tables/proveedor-documento.model';
import { Proveedor } from '@model/tables/proveedor.model';

export async function seedProveedorDocumentos(proveedoresData: Proveedor[]) {
  console.log('🌱 Seeding proveedor-documentos...');

  if (proveedoresData.length === 0) {
    console.log('⚠️ Skipping proveedor-documentos (no proveedores)');
    return;
  }

  const documentos = [];

  for (const proveedor of proveedoresData) {
    if (proveedor.tipoDocumento === 'RUC') {
      // Documentos para empresas
      documentos.push({
        proveedorId: proveedor.id,
        tipo: 'Ficha RUC',
        numero: proveedor.ruc || '',
        fechaEmision: '2023-01-15',
        fechaVencimiento: null,
        archivos: ['https://iili.io/fubznoB.jpg'],
      });
      documentos.push({
        proveedorId: proveedor.id,
        tipo: 'Certificado de Proveedor',
        numero: `CERT-${proveedor.id}`,
        fechaEmision: '2024-06-01',
        fechaVencimiento: '2025-06-01',
        archivos: ['https://iili.io/fubzuSa.jpg'],
      });
    } else {
      // Documentos para personas naturales
      documentos.push({
        proveedorId: proveedor.id,
        tipo: 'DNI',
        numero: proveedor.dni || '',
        fechaEmision: '2020-03-10',
        fechaVencimiento: '2030-03-10',
        archivos: ['https://iili.io/fubzRHJ.jpg'],
      });
    }
  }

  await database.insert(proveedorDocumentos).values(documentos);

  console.log(`✅ ${documentos.length} proveedor-documentos inserted`);
}

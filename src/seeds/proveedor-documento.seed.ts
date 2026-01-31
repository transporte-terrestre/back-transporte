import { database } from '@db/connection.db';
import { proveedorDocumentos } from '@db/tables/proveedor-documento.model';
import { Proveedor } from '@db/tables/proveedor.model';

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
        tipo: 'ruc' as const,
        nombre: proveedor.ruc || '',
        url: 'https://iili.io/fubznoB.jpg',
        fechaEmision: '2023-01-15',
        fechaExpiracion: null,
      });
      documentos.push({
        proveedorId: proveedor.id,
        tipo: 'contrato' as const,
        nombre: `CERT-${proveedor.id}`,
        url: 'https://iili.io/fubzuSa.jpg',
        fechaEmision: '2024-06-01',
        fechaExpiracion: '2025-06-01',
      });
    } else {
      // Documentos para personas naturales
      documentos.push({
        proveedorId: proveedor.id,
        tipo: 'dni' as const,
        nombre: proveedor.dni || '',
        url: 'https://iili.io/fubzRHJ.jpg',
        fechaEmision: '2020-03-10',
        fechaExpiracion: '2030-03-10',
      });
    }
  }

  await database.insert(proveedorDocumentos).values(documentos);

  console.log(`✅ ${documentos.length} proveedor-documentos inserted`);
}

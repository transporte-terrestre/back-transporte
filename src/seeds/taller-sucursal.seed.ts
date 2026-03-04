import { database } from '@db/connection.db';
import { sucursales } from '@db/tables/sucursal.table';

export async function seedTallerSucursal() {
  console.log('🌱 Ejecutando seed de Sucursales...');
  try {
    const sucursalesInsertadas = await database
      .insert(sucursales)
      .values([
        {
          departamento: 'Lima',
          provincia: 'Lima',
          distrito: 'San Isidro',
        },
        {
          departamento: 'Arequipa',
          provincia: 'Arequipa',
          distrito: 'Miraflores',
        },
      ])
      .returning();
    console.log('✅ Seed de Sucursales completado!');
    return sucursalesInsertadas;
  } catch (error) {
    console.error('❌ Error en seed de Sucursales:', error);
    throw error;
  }
}

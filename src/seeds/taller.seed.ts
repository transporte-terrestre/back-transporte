import { database } from '@db/connection.db';
import { talleres } from '@db/tables/taller.table';

export async function seedTalleres() {
  console.log('🌱 Seeding workshops...');

  const talleresData = await database
    .insert(talleres)
    .values([
      {
        razonSocial: 'Taller Mecanico Express SAC',
        nombreComercial: 'Taller Mecanico Express',
        ruc: '20100000001',
        tipo: 'externo',
      },
      {
        razonSocial: 'Motor Service Center EIRL',
        nombreComercial: 'Motor Service Center',
        ruc: '20100000002',
        tipo: 'externo',
      },
      {
        razonSocial: 'Frenos y Mas SA',
        nombreComercial: 'Frenos y Mas',
        ruc: '20100000003',
        tipo: 'externo',
      },
      {
        razonSocial: 'Taller Interno Principal',
        nombreComercial: 'Taller Interno',
        tipo: 'interno',
      },
    ])
    .returning();

  console.log('✅ Workshops inserted');
  return talleresData;
}

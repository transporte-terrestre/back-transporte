import { database } from '@db/connection.db';
import { vehiculoPropietarios } from '@db/tables/vehiculo-propietario.table';
import { Vehiculo } from '@db/tables/vehiculo.table';
import { Propietario } from '@db/tables/propietario.table';

function randomElements<T>(arr: readonly T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function seedVehiculoPropietarios(vehiculosData: Vehiculo[], propietariosData: Propietario[]) {
  console.log('🌱 Seeding vehiculo-propietarios...');

  if (vehiculosData.length === 0 || propietariosData.length === 0) {
    console.log('⚠️ Skipping vehiculo-propietarios (missing data)');
    return;
  }

  const relationsToInsert = [];

  for (const vehiculo of vehiculosData) {
    // Assign 1 or 2 owners randomly
    const ownersCount = Math.random() > 0.8 ? 2 : 1;
    const selectedOwners = randomElements(propietariosData, ownersCount);

    for (const owner of selectedOwners) {
      relationsToInsert.push({
        vehiculoId: vehiculo.id,
        propietarioId: owner.id,
      });
    }
  }

  await database.insert(vehiculoPropietarios).values(relationsToInsert);

  console.log(`✅ ${relationsToInsert.length} vehiculo-propietario relations inserted`);
}

import { database } from '@db/connection.db';
import { vehiculoProveedores } from '@model/tables/vehiculo-proveedor.model';
import { Vehiculo } from '@model/tables/vehiculo.model';
import { Proveedor } from '@model/tables/proveedor.model';

function randomElements<T>(arr: readonly T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function seedVehiculoProveedores(vehiculosData: Vehiculo[], proveedoresData: Proveedor[]) {
  console.log('🌱 Seeding vehiculo-proveedores...');

  if (vehiculosData.length === 0 || proveedoresData.length === 0) {
    console.log('⚠️ Skipping vehiculo-proveedores (missing data)');
    return;
  }

  const relationsToInsert = [];

  for (const vehiculo of vehiculosData) {
    // Assign 1 to 3 suppliers randomly
    const suppliersCount = Math.floor(Math.random() * 3) + 1;
    const selectedSuppliers = randomElements(proveedoresData, suppliersCount);

    for (const supplier of selectedSuppliers) {
      relationsToInsert.push({
        vehiculoId: vehiculo.id,
        proveedorId: supplier.id,
      });
    }
  }

  await database.insert(vehiculoProveedores).values(relationsToInsert);

  console.log(`✅ ${relationsToInsert.length} vehiculo-proveedor relations inserted`);
}

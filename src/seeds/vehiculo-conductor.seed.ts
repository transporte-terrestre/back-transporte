import { database } from "@db/connection.db";
import { vehiculosConductores } from "@models/tables/vehiculo-conductor.model";
import { Conductor } from "@models/tables/conductor.model";
import { Vehiculo } from "@models/tables/vehiculo.model";

export async function seedVehiculosConductores(
  driversData: Conductor[],
  vehiclesData: Vehiculo[]
) {
  console.log("🌱 Seeding vehicle assignments...");

  if (driversData.length === 0 || vehiclesData.length === 0) {
    console.log("⚠️ Skipping vehicle assignments (no drivers or vehicles)");
    return;
  }

  await database.insert(vehiculosConductores).values([
    {
      vehiculoId: vehiclesData[0].id,
      conductorId: driversData[0].id,
    },
    {
      vehiculoId: vehiclesData[1].id,
      conductorId: driversData[1].id,
    },
  ]);

  console.log("✅ Vehicle assignments inserted");
}

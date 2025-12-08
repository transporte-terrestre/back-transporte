import { database } from "@db/connection.db";
import { vehiculosConductores } from "@model/tables/vehiculo-conductor.model";
import { Conductor } from "@model/tables/conductor.model";
import { Vehiculo } from "@model/tables/vehiculo.model";

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
    {
      vehiculoId: vehiclesData[2].id,
      conductorId: driversData[2].id,
    },
    {
      vehiculoId: vehiclesData[3].id,
      conductorId: driversData[3].id,
    },
    {
      vehiculoId: vehiclesData[4].id,
      conductorId: driversData[4].id,
    },
    {
      vehiculoId: vehiclesData[5].id,
      conductorId: driversData[5].id,
    },
    {
      vehiculoId: vehiclesData[6].id,
      conductorId: driversData[6].id,
    },
    {
      vehiculoId: vehiclesData[7].id,
      conductorId: driversData[7].id,
    },
    {
      vehiculoId: vehiclesData[8].id,
      conductorId: driversData[8].id,
    },
    {
      vehiculoId: vehiclesData[9].id,
      conductorId: driversData[9].id,
    },
    {
      vehiculoId: vehiclesData[10].id,
      conductorId: driversData[10].id,
    },
    {
      vehiculoId: vehiclesData[11].id,
      conductorId: driversData[11].id,
    },
    {
      vehiculoId: vehiclesData[12].id,
      conductorId: driversData[12].id,
    },
    {
      vehiculoId: vehiclesData[13].id,
      conductorId: driversData[13].id,
    },
    {
      vehiculoId: vehiclesData[14].id,
      conductorId: driversData[14].id,
    },
    {
      vehiculoId: vehiclesData[15].id,
      conductorId: driversData[15].id,
    },
    {
      vehiculoId: vehiclesData[16].id,
      conductorId: driversData[16].id,
    },
    {
      vehiculoId: vehiclesData[17].id,
      conductorId: driversData[17].id,
    },
    {
      vehiculoId: vehiclesData[18].id,
      conductorId: driversData[18].id,
    },
    {
      vehiculoId: vehiclesData[19].id,
      conductorId: driversData[19].id,
    },
    {
      vehiculoId: vehiclesData[20].id,
      conductorId: driversData[20].id,
    },
    {
      vehiculoId: vehiclesData[21].id,
      conductorId: driversData[21].id,
    },
    {
      vehiculoId: vehiclesData[22].id,
      conductorId: driversData[22].id,
    },
    {
      vehiculoId: vehiclesData[23].id,
      conductorId: driversData[23].id,
    },
    {
      vehiculoId: vehiclesData[24].id,
      conductorId: driversData[24].id,
    },
    {
      vehiculoId: vehiclesData[25].id,
      conductorId: driversData[25].id,
    },
    {
      vehiculoId: vehiclesData[26].id,
      conductorId: driversData[26].id,
    },
    {
      vehiculoId: vehiclesData[27].id,
      conductorId: driversData[27].id,
    },
    {
      vehiculoId: vehiclesData[28].id,
      conductorId: driversData[28].id,
    },
    {
      vehiculoId: vehiclesData[29].id,
      conductorId: driversData[29].id,
    },
  ]);

  console.log("✅ Vehicle assignments inserted");
}

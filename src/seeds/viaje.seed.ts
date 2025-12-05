import { database } from "@db/connection.db";
import { viajes } from "@models/tables/viaje.model";
import { Conductor } from "@models/tables/conductor.model";
import { Vehiculo } from "@models/tables/vehiculo.model";
import { Ruta } from "@models/tables/ruta.model";

export async function seedViajes(
  driversData: Conductor[],
  vehiclesData: Vehiculo[],
  routesData: Ruta[]
) {
  console.log("🌱 Seeding trips...");

  if (
    driversData.length === 0 ||
    vehiclesData.length === 0 ||
    routesData.length === 0
  ) {
    console.log("⚠️ Skipping trips (missing dependencies)");
    return;
  }

  await database.insert(viajes).values([
    {
      rutaId: routesData[0].id,
      vehiculoId: vehiclesData[0].id,
      conductorId: driversData[0].id,
      fechaSalida: new Date("2024-03-01T08:00:00Z"),
      fechaLlegada: new Date("2024-03-01T12:00:00Z"),
      estado: "completado",
    },
    {
      rutaId: routesData[1].id,
      vehiculoId: vehiclesData[1].id,
      conductorId: driversData[1].id,
      fechaSalida: new Date("2024-03-05T09:00:00Z"),
      estado: "en_progreso",
    },
    {
      rutaId: routesData[2].id,
      vehiculoId: vehiclesData[2].id,
      conductorId: driversData[2].id,
      fechaSalida: new Date("2024-03-10T07:00:00Z"),
      estado: "programado",
    },
  ]);

  console.log("✅ Trips inserted");
}

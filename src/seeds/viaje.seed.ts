import { database } from "@db/connection.db";
import { viajes } from "@model/tables/viaje.model";
import { Conductor } from "@model/tables/conductor.model";
import { Vehiculo } from "@model/tables/vehiculo.model";
import { Ruta } from "@model/tables/ruta.model";
import { getDateTime } from "@function/date.function";

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
      fechaSalida: getDateTime(-30, 8),
      fechaLlegada: getDateTime(-30, 12),
      estado: "completado",
    },
    {
      rutaId: routesData[1].id,
      vehiculoId: vehiclesData[1].id,
      conductorId: driversData[1].id,
      fechaSalida: getDateTime(-28, 9),
      fechaLlegada: getDateTime(-28, 14, 30),
      estado: "completado",
    },
    {
      rutaId: routesData[2].id,
      vehiculoId: vehiclesData[2].id,
      conductorId: driversData[2].id,
      fechaSalida: getDateTime(-26, 7),
      fechaLlegada: getDateTime(-26, 13),
      estado: "completado",
    },
    {
      rutaId: routesData[3].id,
      vehiculoId: vehiclesData[3].id,
      conductorId: driversData[3].id,
      fechaSalida: getDateTime(-24, 8, 30),
      fechaLlegada: getDateTime(-24, 16),
      estado: "completado",
    },
    {
      rutaId: routesData[4].id,
      vehiculoId: vehiclesData[4].id,
      conductorId: driversData[4].id,
      fechaSalida: getDateTime(-22, 10),
      fechaLlegada: getDateTime(-22, 18),
      estado: "completado",
    },
    {
      rutaId: routesData[5].id,
      vehiculoId: vehiclesData[5].id,
      conductorId: driversData[5].id,
      fechaSalida: getDateTime(-20, 6),
      fechaLlegada: getDateTime(-20, 14),
      estado: "completado",
    },
    {
      rutaId: routesData[6].id,
      vehiculoId: vehiclesData[6].id,
      conductorId: driversData[6].id,
      fechaSalida: getDateTime(-18, 9),
      fechaLlegada: getDateTime(-18, 13),
      estado: "completado",
    },
    {
      rutaId: routesData[7].id,
      vehiculoId: vehiclesData[7].id,
      conductorId: driversData[7].id,
      fechaSalida: getDateTime(-16, 7, 30),
      fechaLlegada: getDateTime(-16, 12, 30),
      estado: "completado",
    },
    {
      rutaId: routesData[8].id,
      vehiculoId: vehiclesData[8].id,
      conductorId: driversData[8].id,
      fechaSalida: getDateTime(-14, 8),
      fechaLlegada: getDateTime(-14, 14),
      estado: "completado",
    },
    {
      rutaId: routesData[9].id,
      vehiculoId: vehiclesData[9].id,
      conductorId: driversData[9].id,
      fechaSalida: getDateTime(-12, 10),
      fechaLlegada: getDateTime(-12, 14, 30),
      estado: "completado",
    },
    {
      rutaId: routesData[10].id,
      vehiculoId: vehiclesData[10].id,
      conductorId: driversData[10].id,
      fechaSalida: getDateTime(-10, 6, 30),
      fechaLlegada: getDateTime(-10, 11),
      estado: "completado",
    },
    {
      rutaId: routesData[11].id,
      vehiculoId: vehiclesData[11].id,
      conductorId: driversData[11].id,
      fechaSalida: getDateTime(-8, 9),
      fechaLlegada: getDateTime(-8, 17),
      estado: "completado",
    },
    {
      rutaId: routesData[12].id,
      vehiculoId: vehiclesData[12].id,
      conductorId: driversData[12].id,
      fechaSalida: getDateTime(-6, 8),
      fechaLlegada: getDateTime(-6, 18),
      estado: "completado",
    },
    {
      rutaId: routesData[13].id,
      vehiculoId: vehiclesData[13].id,
      conductorId: driversData[13].id,
      fechaSalida: getDateTime(-5, 7),
      fechaLlegada: getDateTime(-5, 19),
      estado: "completado",
    },
    {
      rutaId: routesData[14].id,
      vehiculoId: vehiclesData[14].id,
      conductorId: driversData[14].id,
      fechaSalida: getDateTime(-4, 10),
      fechaLlegada: getDateTime(-4, 12),
      estado: "completado",
    },
    {
      rutaId: routesData[15].id,
      vehiculoId: vehiclesData[15].id,
      conductorId: driversData[15].id,
      fechaSalida: getDateTime(-3, 8, 30),
      fechaLlegada: getDateTime(-3, 11),
      estado: "completado",
    },
    {
      rutaId: routesData[16].id,
      vehiculoId: vehiclesData[16].id,
      conductorId: driversData[16].id,
      fechaSalida: getDateTime(-2, 9),
      fechaLlegada: getDateTime(-2, 12),
      estado: "completado",
    },
    {
      rutaId: routesData[17].id,
      vehiculoId: vehiclesData[17].id,
      conductorId: driversData[17].id,
      fechaSalida: getDateTime(-1, 7),
      fechaLlegada: getDateTime(-1, 11, 30),
      estado: "completado",
    },
    {
      rutaId: routesData[18].id,
      vehiculoId: vehiclesData[18].id,
      conductorId: driversData[18].id,
      fechaSalida: getDateTime(0, 8),
      estado: "en_progreso",
    },
    {
      rutaId: routesData[19].id,
      vehiculoId: vehiclesData[19].id,
      conductorId: driversData[19].id,
      fechaSalida: getDateTime(0, 10),
      estado: "en_progreso",
    },
    {
      rutaId: routesData[20].id,
      vehiculoId: vehiclesData[20].id,
      conductorId: driversData[20].id,
      fechaSalida: getDateTime(1, 8, 30),
      estado: "programado",
    },
    {
      rutaId: routesData[21].id,
      vehiculoId: vehiclesData[21].id,
      conductorId: driversData[21].id,
      fechaSalida: getDateTime(2, 10),
      estado: "programado",
    },
    {
      rutaId: routesData[22].id,
      vehiculoId: vehiclesData[22].id,
      conductorId: driversData[22].id,
      fechaSalida: getDateTime(3, 9),
      estado: "programado",
    },
    {
      rutaId: routesData[23].id,
      vehiculoId: vehiclesData[23].id,
      conductorId: driversData[23].id,
      fechaSalida: getDateTime(4, 7, 30),
      estado: "programado",
    },
    {
      rutaId: routesData[24].id,
      vehiculoId: vehiclesData[24].id,
      conductorId: driversData[24].id,
      fechaSalida: getDateTime(5, 8),
      estado: "programado",
    },
    {
      rutaId: routesData[25].id,
      vehiculoId: vehiclesData[25].id,
      conductorId: driversData[25].id,
      fechaSalida: getDateTime(6, 9, 30),
      estado: "programado",
    },
    {
      rutaId: routesData[26].id,
      vehiculoId: vehiclesData[26].id,
      conductorId: driversData[26].id,
      fechaSalida: getDateTime(7, 10),
      estado: "programado",
    },
    {
      rutaId: routesData[27].id,
      vehiculoId: vehiclesData[27].id,
      conductorId: driversData[27].id,
      fechaSalida: getDateTime(8, 8),
      estado: "programado",
    },
    {
      rutaId: routesData[28].id,
      vehiculoId: vehiclesData[28].id,
      conductorId: driversData[28].id,
      fechaSalida: getDateTime(9, 7),
      estado: "programado",
    },
    {
      rutaId: routesData[29].id,
      vehiculoId: vehiclesData[29].id,
      conductorId: driversData[29].id,
      fechaSalida: getDateTime(10, 9),
      estado: "programado",
    },
  ]);

  console.log("✅ Trips inserted");
}

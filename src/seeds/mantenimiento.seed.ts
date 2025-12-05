import { database } from "@db/connection.db";
import { mantenimientos } from "@models/tables/mantenimiento.model";
import { Vehiculo } from "@models/tables/vehiculo.model";

export async function seedMantenimientos(vehiclesData: Vehiculo[]) {
  console.log("🌱 Seeding maintenances...");

  if (vehiclesData.length === 0) {
    console.log("⚠️ Skipping maintenances (no vehicles)");
    return;
  }

  await database.insert(mantenimientos).values([
    {
      vehiculoId: vehiclesData[0].id,
      tipo: "preventivo",
      costo: "200.00",
      descripcion: "Oil change and general checkup",
      fecha: "2024-01-15",
      kilometraje: 45000,
      proveedor: "Taller Mecanico Express",
    },
    {
      vehiculoId: vehiclesData[2].id,
      tipo: "correctivo",
      costo: "1500.00",
      descripcion: "Brake replacement",
      fecha: "2024-02-20",
      kilometraje: 78000,
      proveedor: "Frenos y Mas",
    },
  ]);

  console.log("✅ Maintenances inserted");
}

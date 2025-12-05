import { database } from "@db/connection.db";
import { vehiculos } from "@models/tables/vehiculo.model";

export async function seedVehiculos() {
  console.log("🌱 Seeding vehicles...");

  const vehiclesData = await database
    .insert(vehiculos)
    .values([
      {
        placa: "ABC-123",
        marca: "Toyota",
        modelo: "Corolla",
        anio: 2020,
        kilometraje: 50000,
        fechaVencimientoSoat: "2025-01-01",
        estado: "activo",
      },
      {
        placa: "XYZ-789",
        marca: "Hyundai",
        modelo: "Elantra",
        anio: 2021,
        kilometraje: 30000,
        fechaVencimientoSoat: "2025-05-15",
        estado: "activo",
      },
      {
        placa: "DEF-456",
        marca: "Nissan",
        modelo: "Sentra",
        anio: 2019,
        kilometraje: 80000,
        fechaVencimientoSoat: "2024-11-20",
        estado: "taller",
      },
    ])
    .returning();

  console.log("✅ Vehicles inserted");
  return vehiclesData;
}

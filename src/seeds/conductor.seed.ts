import { database } from "@db/connection.db";
import { conductores } from "@models/tables/conductor.model";

export async function seedConductores() {
  console.log("🌱 Seeding drivers...");

  const driversData = await database
    .insert(conductores)
    .values([
      {
        dni: "12345678",
        nombre: "Juan Perez Garcia",
        numeroLicencia: "Q07864165",
        claseLicencia: "A",
        categoriaLicencia: "Uno",
        fechaExpedicion: "2020-09-11",
        fechaRevalidacion: "2025-04-19",
      },
      {
        dni: "87654321",
        nombre: "Maria Gomez Torres",
        numeroLicencia: "Q08912345",
        claseLicencia: "B",
        categoriaLicencia: "Dos",
        fechaExpedicion: "2019-06-15",
        fechaRevalidacion: "2024-12-30",
      },
      {
        dni: "11223344",
        nombre: "Carlos Ruiz Sanchez",
        numeroLicencia: "Q09123456",
        claseLicencia: "A",
        categoriaLicencia: "Tres",
        fechaExpedicion: "2021-03-20",
        fechaRevalidacion: "2026-10-15",
      },
    ])
    .returning();

  console.log("✅ Drivers inserted");
  return driversData;
}

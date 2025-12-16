import { database } from "@db/connection.db";
import { talleres } from "@model/tables/taller.model";

export async function seedTalleres() {
  console.log("🌱 Seeding workshops...");

  const talleresData = await database
    .insert(talleres)
    .values([
      {
        razonSocial: "Taller Mecanico Express SAC",
        nombreComercial: "Taller Mecanico Express",
        ruc: "20100000001",
        tipo: "externo",
        direccion: "Av. Industrial 123",
      },
      {
        razonSocial: "Motor Service Center EIRL",
        nombreComercial: "Motor Service Center",
        ruc: "20100000002",
        tipo: "externo",
        direccion: "Jr. Los Motores 456",
      },
      {
        razonSocial: "Frenos y Mas SA",
        nombreComercial: "Frenos y Mas",
        ruc: "20100000003",
        tipo: "externo",
        direccion: "Calle Las Ruedas 789",
      },
      {
        razonSocial: "Taller Interno Principal",
        nombreComercial: "Taller Interno",
        tipo: "interno",
        direccion: "Sede Central",
      },
    ])
    .returning();

  console.log("✅ Workshops inserted");
  return talleresData;
}

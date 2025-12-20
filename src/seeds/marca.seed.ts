import { database } from "@db/connection.db";
import { marcas } from "@model/tables/marca.model";

export async function seedMarcas() {
  console.log("🌱 Seeding brands...");

  const marcasData = await database
    .insert(marcas)
    .values([
      { nombre: "Toyota" },
      { nombre: "Hyundai" },
      { nombre: "Nissan" },
      { nombre: "Honda" },
      { nombre: "Mazda" },
      { nombre: "Chevrolet" },
      { nombre: "Kia" },
      { nombre: "Volkswagen" },
      { nombre: "Ford" },
      { nombre: "Suzuki" },
      { nombre: "Mitsubishi" },
      { nombre: "Subaru" },
      { nombre: "Mercedes-Benz" },
      { nombre: "BMW" },
      { nombre: "Audi" },
      { nombre: "Volvo" },
      { nombre: "Peugeot" },
      { nombre: "Renault" },
      { nombre: "Citroën" },
      { nombre: "Fiat" },
      { nombre: "Jeep" },
      { nombre: "Dodge" },
      { nombre: "RAM" },
      { nombre: "GMC" },
      { nombre: "Isuzu" },
      { nombre: "Hino" },
      { nombre: "Scania" },
      { nombre: "Volvo Trucks" },
      { nombre: "MAN" },
      { nombre: "JAC" },
    ])
    .returning();

  console.log("✅ Brands inserted");
  return marcasData;
}

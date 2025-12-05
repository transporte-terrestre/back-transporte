import { database } from "@db/connection.db";
import { rutas } from "@models/tables/ruta.model";

export async function seedRutas() {
  console.log("🌱 Seeding routes...");

  const routesData = await database
    .insert(rutas)
    .values([
      {
        origen: "Lima",
        destino: "Ica",
        origenLat: "-12.0464",
        origenLng: "-77.0428",
        destinoLat: "-14.0678",
        destinoLng: "-75.7286",
        distancia: "300.00",
        costoBase: "150.00",
      },
      {
        origen: "Lima",
        destino: "Trujillo",
        origenLat: "-12.0464",
        origenLng: "-77.0428",
        destinoLat: "-8.1116",
        destinoLng: "-79.0288",
        distancia: "560.00",
        costoBase: "250.00",
      },
      {
        origen: "Arequipa",
        destino: "Cusco",
        origenLat: "-16.4090",
        origenLng: "-71.5375",
        destinoLat: "-13.5319",
        destinoLng: "-71.9675",
        distancia: "500.00",
        costoBase: "200.00",
      },
    ])
    .returning();

  console.log("✅ Routes inserted");
  return routesData;
}

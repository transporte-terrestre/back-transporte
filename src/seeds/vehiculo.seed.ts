import { database } from "@db/connection.db";
import { Vehiculo, vehiculos } from "@model/tables/vehiculo.model";
import { Modelo } from "@model/tables/modelo.model";
import { eq } from "drizzle-orm";

function randomElement<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Datos de vehículos: [placa, anio, kilometraje, estado, imagen]
const vehiculosData: [
  string,
  number,
  number,
  "activo" | "taller" | "retirado",
  string,
][] = [
  ["ABC123", 2020, 50000, "activo", "https://iili.io/fubanob.jpg"],
  ["XYZ789", 2021, 30000, "activo", "https://iili.io/fubaxix.jpg"],
  ["DEF456", 2019, 80000, "taller", "https://iili.io/fubauUB.jpg"],
  ["GHI321", 2022, 20000, "activo", "https://iili.io/fuba5R1.jpg"],
  ["JKL654", 2020, 45000, "activo", "https://iili.io/fubaYDg.jpg"],
  ["MNO987", 2019, 70000, "activo", "https://iili.io/fubaEfR.jpg"],
  ["PQR234", 2021, 35000, "activo", "https://iili.io/fubaWJI.jpg"],
  ["STU567", 2020, 55000, "taller", "https://iili.io/fubaXRt.jpg"],
  ["VWX890", 2018, 95000, "activo", "https://iili.io/fubahOX.jpg"],
  ["YZA123", 2021, 28000, "activo", "https://iili.io/fubaNxs.jpg"],
  ["BCD456", 2022, 15000, "activo", "https://iili.io/fubavf4.webp"],
  ["EFG789", 2020, 48000, "activo", "https://iili.io/fuba80l.webp"],
  ["HIJ012", 2021, 32000, "activo", "https://iili.io/fubaSg2.webp"],
  ["KLM345", 2019, 75000, "activo", "https://iili.io/fubar57.webp"],
  ["NOP678", 2020, 52000, "activo", "https://iili.io/fuba4e9.webp"],
  ["QRS901", 2018, 88000, "taller", "https://iili.io/fubaizu.webp"],
  ["TUV234", 2021, 38000, "activo", "https://iili.io/fubasWb.webp"],
  ["WXY567", 2022, 18000, "activo", "https://iili.io/fubaZqx.webp"],
  ["ZAB890", 2019, 68000, "activo", "https://iili.io/fubaDgV.webp"],
  ["CDE123", 2020, 42000, "activo", "https://iili.io/fubamdB.webp"],
  ["FGH456", 2021, 25000, "activo", "https://iili.io/fubaye1.webp"],
  ["IJK789", 2020, 58000, "activo", "https://iili.io/fubc9mF.webp"],
  ["LMN012", 2019, 72000, "activo", "https://iili.io/fubcdXa.webp"],
  ["OPQ345", 2022, 12000, "activo", "https://iili.io/fubc2LJ.webp"],
  ["RST678", 2021, 36000, "activo", "https://iili.io/fubcBdN.webp"],
  ["UVW901", 2020, 62000, "activo", "https://iili.io/fubcnet.webp"],
  ["XYZ234", 2019, 78000, "taller", "https://iili.io/fubczIn.webp"],
  ["ABC567", 2021, 40000, "activo", "https://iili.io/fubcTLG.webp"],
  ["DEF890", 2020, 54000, "activo", "https://iili.io/fubc5rl.webp"],
  ["GHI123", 2022, 22000, "activo", "https://iili.io/fubcY22.webp"],
];

export async function seedVehiculos(
  modelosData: Modelo[]
): Promise<Vehiculo[]> {
  console.log("🌱 Seeding vehicles...");

  if (modelosData.length === 0) {
    console.log("⚠️ Skipping vehicles (no models available)");
    return [];
  }

  // Preparar valores para insertar (sin codigoInterno, se genera después)
  const vehiculosValues = vehiculosData.map(
    ([placa, anio, kilometraje, estado, imagen]) => {
      return {
        placa,
        modeloId: randomElement(modelosData).id,
        anio,
        kilometraje,
        estado,
        imagenes: [imagen],
      };
    }
  );

  const insertedVehicles = await database
    .insert(vehiculos)
    .values(vehiculosValues)
    .returning();

  // Actualizar con codigoInterno basado en el ID (formato: 00001)
  const updatedVehicles: Vehiculo[] = [];
  for (const vehicle of insertedVehicles) {
    const codigoInterno = String(vehicle.id).padStart(5, "0");
    const [updated] = await database
      .update(vehiculos)
      .set({ codigoInterno })
      .where(eq(vehiculos.id, vehicle.id))
      .returning();
    updatedVehicles.push(updated);
  }

  console.log("✅ Vehicles inserted with auto-generated codigoInterno");
  return updatedVehicles;
}

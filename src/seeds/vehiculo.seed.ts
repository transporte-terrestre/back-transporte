import { database } from "@db/connection.db";
import { Vehiculo, vehiculos } from "@model/tables/vehiculo.model";
import { Modelo } from "@model/tables/modelo.model";

// Helper function
function randomElement<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Datos de vehículos: [placa, codigoInterno, anio, kilometraje, estado, imagen]
const vehiculosData: [
  string,
  string,
  number,
  number,
  "activo" | "taller" | "retirado",
  string,
][] = [
  ["ABC123", "0001", 2020, 50000, "activo", "https://iili.io/fubanob.jpg"],
  ["XYZ789", "0002", 2021, 30000, "activo", "https://iili.io/fubaxix.jpg"],
  ["DEF456", "0003", 2019, 80000, "taller", "https://iili.io/fubauUB.jpg"],
  ["GHI321", "0004", 2022, 20000, "activo", "https://iili.io/fuba5R1.jpg"],
  ["JKL654", "0005", 2020, 45000, "activo", "https://iili.io/fubaYDg.jpg"],
  ["MNO987", "0006", 2019, 70000, "activo", "https://iili.io/fubaEfR.jpg"],
  ["PQR234", "0007", 2021, 35000, "activo", "https://iili.io/fubaWJI.jpg"],
  ["STU567", "0008", 2020, 55000, "taller", "https://iili.io/fubaXRt.jpg"],
  ["VWX890", "0009", 2018, 95000, "activo", "https://iili.io/fubahOX.jpg"],
  ["YZA123", "0010", 2021, 28000, "activo", "https://iili.io/fubaNxs.jpg"],
  ["BCD456", "0011", 2022, 15000, "activo", "https://iili.io/fubavf4.webp"],
  ["EFG789", "0012", 2020, 48000, "activo", "https://iili.io/fuba80l.webp"],
  ["HIJ012", "0013", 2021, 32000, "activo", "https://iili.io/fubaSg2.webp"],
  ["KLM345", "0014", 2019, 75000, "activo", "https://iili.io/fubar57.webp"],
  ["NOP678", "0015", 2020, 52000, "activo", "https://iili.io/fuba4e9.webp"],
  ["QRS901", "0016", 2018, 88000, "taller", "https://iili.io/fubaizu.webp"],
  ["TUV234", "0017", 2021, 38000, "activo", "https://iili.io/fubasWb.webp"],
  ["WXY567", "0018", 2022, 18000, "activo", "https://iili.io/fubaZqx.webp"],
  ["ZAB890", "0019", 2019, 68000, "activo", "https://iili.io/fubaDgV.webp"],
  ["CDE123", "0020", 2020, 42000, "activo", "https://iili.io/fubamdB.webp"],
  ["FGH456", "0021", 2021, 25000, "activo", "https://iili.io/fubaye1.webp"],
  ["IJK789", "0022", 2020, 58000, "activo", "https://iili.io/fubc9mF.webp"],
  ["LMN012", "0023", 2019, 72000, "activo", "https://iili.io/fubcdXa.webp"],
  ["OPQ345", "0024", 2022, 12000, "activo", "https://iili.io/fubc2LJ.webp"],
  ["RST678", "0025", 2021, 36000, "activo", "https://iili.io/fubcBdN.webp"],
  ["UVW901", "0026", 2020, 62000, "activo", "https://iili.io/fubcnet.webp"],
  ["XYZ234", "0027", 2019, 78000, "taller", "https://iili.io/fubczIn.webp"],
  ["ABC567", "0028", 2021, 40000, "activo", "https://iili.io/fubcTLG.webp"],
  ["DEF890", "0029", 2020, 54000, "activo", "https://iili.io/fubc5rl.webp"],
  ["GHI123", "0030", 2022, 22000, "activo", "https://iili.io/fubcY22.webp"],
];

export async function seedVehiculos(
  modelosData: Modelo[]
): Promise<Vehiculo[]> {
  console.log("🌱 Seeding vehicles...");

  if (modelosData.length === 0) {
    console.log("⚠️ Skipping vehicles (no models available)");
    return [];
  }

  // Preparar valores para insertar con modeloId aleatorio
  const vehiculosValues = vehiculosData.map(
    ([placa, codigoInterno, anio, kilometraje, estado, imagen]) => {
      return {
        placa,
        codigoInterno,
        modeloId: randomElement(modelosData).id,
        anio,
        kilometraje,
        estado,
        imagenes: [imagen],
      };
    }
  );

  const result = await database
    .insert(vehiculos)
    .values(vehiculosValues)
    .returning();

  console.log("✅ Vehicles inserted");
  return result;
}

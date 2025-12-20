import { database } from "@db/connection.db";
import { vehiculos } from "@model/tables/vehiculo.model";
import { modelos } from "@model/tables/modelo.model";
import { marcas } from "@model/tables/marca.model";
import { eq } from "drizzle-orm";

// Mapeo de vehículos: [placa, codigoInterno, marca, modelo, anio, kilometraje, estado, imagen]
const vehiculosData: [
  string,
  string,
  string,
  string,
  number,
  number,
  "activo" | "taller" | "retirado",
  string,
][] = [
  [
    "ABC123",
    "0001",
    "Toyota",
    "Corolla",
    2020,
    50000,
    "activo",
    "https://iili.io/fubanob.jpg",
  ],
  [
    "XYZ789",
    "0002",
    "Hyundai",
    "Elantra",
    2021,
    30000,
    "activo",
    "https://iili.io/fubaxix.jpg",
  ],
  [
    "DEF456",
    "0003",
    "Nissan",
    "Sentra",
    2019,
    80000,
    "taller",
    "https://iili.io/fubauUB.jpg",
  ],
  [
    "GHI321",
    "0004",
    "Honda",
    "Civic",
    2022,
    20000,
    "activo",
    "https://iili.io/fuba5R1.jpg",
  ],
  [
    "JKL654",
    "0005",
    "Mazda",
    "Mazda3",
    2020,
    45000,
    "activo",
    "https://iili.io/fubaYDg.jpg",
  ],
  [
    "MNO987",
    "0006",
    "Chevrolet",
    "Cruze",
    2019,
    70000,
    "activo",
    "https://iili.io/fubaEfR.jpg",
  ],
  [
    "PQR234",
    "0007",
    "Kia",
    "Forte",
    2021,
    35000,
    "activo",
    "https://iili.io/fubaWJI.jpg",
  ],
  [
    "STU567",
    "0008",
    "Volkswagen",
    "Jetta",
    2020,
    55000,
    "taller",
    "https://iili.io/fubaXRt.jpg",
  ],
  [
    "VWX890",
    "0009",
    "Ford",
    "Focus",
    2018,
    95000,
    "activo",
    "https://iili.io/fubahOX.jpg",
  ],
  [
    "YZA123",
    "0010",
    "Suzuki",
    "Ciaz",
    2021,
    28000,
    "activo",
    "https://iili.io/fubaNxs.jpg",
  ],
  [
    "BCD456",
    "0011",
    "Toyota",
    "Yaris",
    2022,
    15000,
    "activo",
    "https://iili.io/fubavf4.webp",
  ],
  [
    "EFG789",
    "0012",
    "Hyundai",
    "Accent",
    2020,
    48000,
    "activo",
    "https://iili.io/fuba80l.webp",
  ],
  [
    "HIJ012",
    "0013",
    "Nissan",
    "Versa",
    2021,
    32000,
    "activo",
    "https://iili.io/fubaSg2.webp",
  ],
  [
    "KLM345",
    "0014",
    "Honda",
    "City",
    2019,
    75000,
    "activo",
    "https://iili.io/fubar57.webp",
  ],
  [
    "NOP678",
    "0015",
    "Mazda",
    "Mazda2",
    2020,
    52000,
    "activo",
    "https://iili.io/fuba4e9.webp",
  ],
  [
    "QRS901",
    "0016",
    "Chevrolet",
    "Sail",
    2018,
    88000,
    "taller",
    "https://iili.io/fubaizu.webp",
  ],
  [
    "TUV234",
    "0017",
    "Kia",
    "Rio",
    2021,
    38000,
    "activo",
    "https://iili.io/fubasWb.webp",
  ],
  [
    "WXY567",
    "0018",
    "Volkswagen",
    "Polo",
    2022,
    18000,
    "activo",
    "https://iili.io/fubaZqx.webp",
  ],
  [
    "ZAB890",
    "0019",
    "Ford",
    "Fiesta",
    2019,
    68000,
    "activo",
    "https://iili.io/fubaDgV.webp",
  ],
  [
    "CDE123",
    "0020",
    "Suzuki",
    "Swift",
    2020,
    42000,
    "activo",
    "https://iili.io/fubamdB.webp",
  ],
  [
    "FGH456",
    "0021",
    "Toyota",
    "Camry",
    2021,
    25000,
    "activo",
    "https://iili.io/fubaye1.webp",
  ],
  [
    "IJK789",
    "0022",
    "Hyundai",
    "Sonata",
    2020,
    58000,
    "activo",
    "https://iili.io/fubc9mF.webp",
  ],
  [
    "LMN012",
    "0023",
    "Nissan",
    "Altima",
    2019,
    72000,
    "activo",
    "https://iili.io/fubcdXa.webp",
  ],
  [
    "OPQ345",
    "0024",
    "Honda",
    "Accord",
    2022,
    12000,
    "activo",
    "https://iili.io/fubc2LJ.webp",
  ],
  [
    "RST678",
    "0025",
    "Mazda",
    "Mazda6",
    2021,
    36000,
    "activo",
    "https://iili.io/fubcBdN.webp",
  ],
  [
    "UVW901",
    "0026",
    "Chevrolet",
    "Malibu",
    2020,
    62000,
    "activo",
    "https://iili.io/fubcnet.webp",
  ],
  [
    "XYZ234",
    "0027",
    "Kia",
    "Optima",
    2019,
    78000,
    "taller",
    "https://iili.io/fubczIn.webp",
  ],
  [
    "ABC567",
    "0028",
    "Volkswagen",
    "Passat",
    2021,
    40000,
    "activo",
    "https://iili.io/fubcTLG.webp",
  ],
  [
    "DEF890",
    "0029",
    "Ford",
    "Fusion",
    2020,
    54000,
    "activo",
    "https://iili.io/fubc5rl.webp",
  ],
  [
    "GHI123",
    "0030",
    "Suzuki",
    "Baleno",
    2022,
    22000,
    "activo",
    "https://iili.io/fubcY22.webp",
  ],
];

export async function seedVehiculos() {
  console.log("🌱 Seeding vehicles...");

  // Obtener todos los modelos con su marca
  const modelosConMarca = await database
    .select({
      modeloId: modelos.id,
      modeloNombre: modelos.nombre,
      marcaNombre: marcas.nombre,
    })
    .from(modelos)
    .innerJoin(marcas, eq(modelos.marcaId, marcas.id));

  // Crear mapa: "marca|modelo" -> modeloId
  const modeloIdMap = new Map<string, number>();
  for (const m of modelosConMarca) {
    const key = `${m.marcaNombre}|${m.modeloNombre}`;
    modeloIdMap.set(key, m.modeloId);
  }

  // Preparar valores para insertar
  const vehiculosValues = vehiculosData.map(
    ([
      placa,
      codigoInterno,
      marca,
      modelo,
      anio,
      kilometraje,
      estado,
      imagen,
    ]) => {
      const key = `${marca}|${modelo}`;
      const modeloId = modeloIdMap.get(key);

      if (!modeloId) {
        throw new Error(
          `Modelo "${modelo}" de marca "${marca}" no encontrado. Asegúrese de ejecutar seedMarcas y seedModelos primero.`
        );
      }

      return {
        placa,
        codigoInterno,
        modeloId,
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

import { database } from '@db/connection.db';
import { Vehiculo, vehiculos } from '@db/tables/vehiculo.model';
import { Modelo } from '@db/tables/modelo.model';
import { eq } from 'drizzle-orm';

function randomElement<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomAlphanumeric(length: number): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helpers to generate realistic data based on the provided image
const generateVin = () => `93YJ${generateRandomAlphanumeric(13)}`;
const generateMotor = () => `M9TC${generateRandomAlphanumeric(10)}`;

// Datos de vehículos: [placa, anio, kilometraje, estado, imagen, color, combustible, carroceria, categoria]
const vehiculosBaseData: [
  string,
  number,
  number,
  'disponible' | 'taller' | 'retirado' | 'circulacion',
  string,
  string,
  'gasolina' | 'diesel' | 'gnv' | 'glp' | 'electrico' | 'hibrido',
  string,
  string,
][] = [
  ['ABC123', 2020, 50000, 'disponible', 'https://iili.io/fubanob.jpg', 'Blanco', 'diesel', 'PICK UP', 'N1'],
  ['XYZ789', 2021, 30000, 'disponible', 'https://iili.io/fubaxix.jpg', 'Gris', 'gasolina', 'SEDAN', 'M1'],
  ['DEF456', 2019, 80000, 'taller', 'https://iili.io/fubauUB.jpg', 'Rojo', 'diesel', 'CAMION', 'N2'],
  ['GHI321', 2022, 20000, 'disponible', 'https://iili.io/fuba5R1.jpg', 'Azul', 'hibrido', 'SUV', 'M1'],
  ['JKL654', 2020, 45000, 'circulacion', 'https://iili.io/fubaYDg.jpg', 'Negro', 'glp', 'PICK UP', 'N1'],
  ['MNO987', 2019, 70000, 'disponible', 'https://iili.io/fubaEfR.jpg', 'Plata', 'diesel', 'CAMION', 'N3'],
  ['PQR234', 2021, 35000, 'disponible', 'https://iili.io/fubaWJI.jpg', 'Verde', 'gnv', 'PICK UP', 'N1'],
  ['STU567', 2020, 55000, 'taller', 'https://iili.io/fubaXRt.jpg', 'Blanco', 'diesel', 'FURGON', 'N2'],
  ['VWX890', 2018, 95000, 'disponible', 'https://iili.io/fubahOX.jpg', 'Gris', 'diesel', 'CAMION', 'N3'],
  ['YZA123', 2021, 28000, 'disponible', 'https://iili.io/fubaNxs.jpg', 'Azul', 'gasolina', 'SEDAN', 'M1'],
  ['BCD456', 2022, 15000, 'disponible', 'https://iili.io/fubavf4.webp', 'Rojo', 'hibrido', 'SUV', 'M1'],
  ['EFG789', 2020, 48000, 'disponible', 'https://iili.io/fuba80l.webp', 'Negro', 'diesel', 'PICK UP', 'N1'],
  ['HIJ012', 2021, 32000, 'disponible', 'https://iili.io/fubaSg2.webp', 'Blanco', 'gnv', 'SEDAN', 'M1'],
  ['KLM345', 2019, 75000, 'circulacion', 'https://iili.io/fubar57.webp', 'Gris', 'diesel', 'CAMION', 'N2'],
  ['NOP678', 2020, 52000, 'disponible', 'https://iili.io/fuba4e9.webp', 'Azul', 'glp', 'PICK UP', 'N1'],
  ['QRS901', 2018, 88000, 'taller', 'https://iili.io/fubaizu.webp', 'Rojo', 'diesel', 'CAMION', 'N3'],
  ['TUV234', 2021, 38000, 'disponible', 'https://iili.io/fubasWb.webp', 'Negro', 'gasolina', 'SUV', 'M1'],
  ['WXY567', 2022, 18000, 'disponible', 'https://iili.io/fubaZqx.webp', 'Blanco', 'electrico', 'SEDAN', 'M1'],
  ['ZAB890', 2019, 68000, 'disponible', 'https://iili.io/fubaDgV.webp', 'Gris', 'diesel', 'PICK UP', 'N1'],
  ['CDE123', 2020, 42000, 'disponible', 'https://iili.io/fubamdB.webp', 'Azul', 'gnv', 'SUV', 'M1'],
  ['FGH456', 2021, 25000, 'disponible', 'https://iili.io/fubaye1.webp', 'Rojo', 'gasolina', 'SEDAN', 'M1'],
  ['IJK789', 2020, 58000, 'disponible', 'https://iili.io/fubc9mF.webp', 'Negro', 'diesel', 'CAMION', 'N2'],
  ['LMN012', 2019, 72000, 'circulacion', 'https://iili.io/fubcdXa.webp', 'Blanco', 'glp', 'PICK UP', 'N1'],
  ['OPQ345', 2022, 12000, 'disponible', 'https://iili.io/fubc2LJ.webp', 'Gris', 'hibrido', 'SUV', 'M1'],
  ['RST678', 2021, 36000, 'disponible', 'https://iili.io/fubcBdN.webp', 'Azul', 'diesel', 'CAMION', 'N3'],
  ['UVW901', 2020, 62000, 'disponible', 'https://iili.io/fubcnet.webp', 'Rojo', 'gnv', 'PICK UP', 'N1'],
  ['XYZ234', 2019, 78000, 'taller', 'https://iili.io/fubczIn.webp', 'Negro', 'diesel', 'CAMION', 'N2'],
  ['ABC567', 2021, 40000, 'disponible', 'https://iili.io/fubcTLG.webp', 'Blanco', 'gasolina', 'SEDAN', 'M1'],
  ['DEF890', 2020, 54000, 'disponible', 'https://iili.io/fubc5rl.webp', 'Gris', 'diesel', 'PICK UP', 'N1'],
  ['GHI123', 2022, 22000, 'disponible', 'https://iili.io/fubcY22.webp', 'Azul', 'hibrido', 'SUV', 'M1'],
];

export async function seedVehiculos(modelosData: Modelo[]): Promise<Vehiculo[]> {
  console.log('🌱 Seeding vehicles...');

  if (modelosData.length === 0) {
    console.log('⚠️ Skipping vehicles (no models available)');
    return [];
  }

  // Preparar valores para insertar
  const vehiculosValues = vehiculosBaseData.map(([placa, anio, kilometraje, estado, imagen, color, combustible, carroceria, categoria]) => {
    const vinGenerated = generateVin();
    return {
      placa,
      modeloId: randomElement(modelosData).id,
      anio,
      kilometraje,
      estado,
      imagenes: [imagen],
      vin: vinGenerated,
      numeroMotor: generateMotor(),
      numeroSerie: vinGenerated, // Same as VIN in many case files
      color,
      combustible,
      carroceria,
      categoria,
      cargaUtil: (Math.random() * (3000 - 1000) + 1000).toFixed(2),
      pesoBruto: (Math.random() * (5000 - 3000) + 3000).toFixed(2),
      pesoNeto: (Math.random() * (2500 - 1500) + 1500).toFixed(2),
      asientos: Math.floor(Math.random() * 5) + 2,
      ejes: Math.random() > 0.8 ? 3 : 2,
      anioModelo: anio + 1,
      pasajeros: Math.floor(Math.random() * 40) + 10,
      ruedas: Math.random() > 0.5 ? 4 : 6,
      anotaciones: 'Sin novedades',
      sede: randomElement(['Lima', 'Arequipa', 'Trujillo', 'Cusco']),
      potencia: `${Math.floor(Math.random() * 200 + 100)}hp`,
      formulaRodante: Math.random() > 0.5 ? '4x2' : '4x4',
      version: 'V' + Math.floor(Math.random() * 5 + 1),
      cilindros: Math.random() > 0.5 ? 4 : 6,
      cilindrada: `${(Math.random() * 4 + 1).toFixed(1)}L`,
      longitud: (Math.random() * 10 + 4).toFixed(2),
      altura: (Math.random() * 2 + 1.5).toFixed(2),
      ancho: (Math.random() * 1 + 1.8).toFixed(2),
    };
  });

  const insertedVehicles = await database.insert(vehiculos).values(vehiculosValues).returning();

  // Actualizar con codigoInterno basado en el ID (formato: 00001)
  const updatedVehicles: Vehiculo[] = [];
  for (const vehicle of insertedVehicles) {
    const codigoInterno = String(vehicle.id).padStart(5, '0');
    const [updated] = await database.update(vehiculos).set({ codigoInterno }).where(eq(vehiculos.id, vehicle.id)).returning();
    updatedVehicles.push(updated);
  }

  console.log(`✅ ${updatedVehicles.length} vehicles inserted with auto-generated technical data based on SUNARP`);
  return updatedVehicles;
}

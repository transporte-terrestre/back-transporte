import { database } from "@db/connection.db";
import { Modelo, modelos } from "@model/tables/modelo.model";
import { Marca } from "@model/tables/marca.model";

// Mapa de modelos por marca (mínimo 5 modelos por marca)
const modelosPorMarca: Record<string, string[]> = {
  Toyota: [
    "Corolla",
    "Yaris",
    "Camry",
    "RAV4",
    "Hilux",
    "Land Cruiser",
    "Hiace",
    "Coaster",
  ],
  Hyundai: [
    "Elantra",
    "Accent",
    "Sonata",
    "Tucson",
    "Santa Fe",
    "County",
    "H-1",
  ],
  Nissan: [
    "Sentra",
    "Versa",
    "Altima",
    "Frontier",
    "Navara",
    "X-Trail",
    "Urvan",
  ],
  Honda: ["Civic", "City", "Accord", "CR-V", "HR-V", "Pilot", "Odyssey"],
  Mazda: ["Mazda2", "Mazda3", "Mazda6", "CX-3", "CX-5", "CX-9", "BT-50"],
  Chevrolet: [
    "Cruze",
    "Sail",
    "Malibu",
    "Tracker",
    "Equinox",
    "Silverado",
    "N300",
  ],
  Kia: ["Forte", "Rio", "Optima", "Sportage", "Sorento", "Carnival", "Bongo"],
  Volkswagen: [
    "Jetta",
    "Polo",
    "Passat",
    "Tiguan",
    "T-Cross",
    "Amarok",
    "Crafter",
  ],
  Ford: ["Focus", "Fiesta", "Fusion", "Escape", "Explorer", "F-150", "Transit"],
  Suzuki: ["Ciaz", "Swift", "Baleno", "Vitara", "Jimny", "Ertiga", "Carry"],
  Mitsubishi: [
    "Lancer",
    "Mirage",
    "Outlander",
    "ASX",
    "L200",
    "Montero",
    "Canter",
  ],
  Subaru: ["Impreza", "Legacy", "Outback", "Forester", "XV", "WRX"],
  "Mercedes-Benz": [
    "Clase A",
    "Clase C",
    "Clase E",
    "Clase S",
    "GLC",
    "Sprinter",
    "Actros",
  ],
  BMW: ["Serie 1", "Serie 3", "Serie 5", "Serie 7", "X1", "X3", "X5"],
  Audi: ["A1", "A3", "A4", "A6", "Q3", "Q5", "Q7"],
  Volvo: ["S60", "S90", "XC40", "XC60", "XC90", "V60", "V90"],
  Peugeot: ["208", "301", "308", "3008", "5008", "Partner", "Expert"],
  Renault: [
    "Logan",
    "Sandero",
    "Megane",
    "Duster",
    "Koleos",
    "Kangoo",
    "Master",
  ],
  Citroën: ["C3", "C4", "C5", "Berlingo", "Jumpy", "Jumper", "SpaceTourer"],
  Fiat: ["Uno", "Palio", "Cronos", "Toro", "Ducato", "Doblo", "Strada"],
  Jeep: [
    "Renegade",
    "Compass",
    "Cherokee",
    "Grand Cherokee",
    "Wrangler",
    "Gladiator",
  ],
  Dodge: ["Attitude", "Neon", "Challenger", "Charger", "Durango", "Journey"],
  RAM: ["RAM 700", "RAM 1200", "RAM 1500", "RAM 2500", "RAM 3500", "ProMaster"],
  GMC: ["Sierra 1500", "Sierra 2500", "Canyon", "Acadia", "Terrain", "Yukon"],
  Isuzu: ["D-Max", "MU-X", "NHR", "NKR", "NPR", "NQR", "FVR"],
  Hino: ["300", "500", "700", "Dutro", "Ranger", "Profia"],
  Scania: ["Serie G", "Serie R", "Serie S", "Serie P", "Serie L", "XT"],
  "Volvo Trucks": ["FH", "FM", "FMX", "FE", "FL", "VNL"],
  MAN: ["TGX", "TGS", "TGM", "TGL", "TGE", "Lion's City"],
  JAC: ["Refine", "T6", "T8", "N56", "N80", "Sunray"],
};

export async function seedModelos(marcasData: Marca[]): Promise<Modelo[]> {
  console.log("🌱 Seeding models...");

  // Crear mapa de nombre -> id
  const marcaIdMap = new Map<string, number>();
  for (const marca of marcasData) {
    marcaIdMap.set(marca.nombre, marca.id);
  }

  // Preparar valores para insertar
  const modelosValues: { nombre: string; marcaId: number }[] = [];

  for (const [nombreMarca, nombresModelos] of Object.entries(modelosPorMarca)) {
    const marcaId = marcaIdMap.get(nombreMarca);
    if (marcaId) {
      for (const nombreModelo of nombresModelos) {
        modelosValues.push({
          nombre: nombreModelo,
          marcaId: marcaId,
        });
      }
    }
  }

  const modelosData = await database
    .insert(modelos)
    .values(modelosValues)
    .returning();

  console.log("✅ Models inserted");
  return modelosData;
}

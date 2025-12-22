import { database } from "@db/connection.db";
import { tareas } from "@model/tables/tarea.model";

export async function seedTareas() {
  console.log("🌱 Seeding tasks catalog...");

  const tareasData = await database
    .insert(tareas)
    .values([
      // Sistema de Frenos
      { codigo: "FRN-001", descripcion: "Revisar sistema de frenos" },
      {
        codigo: "FRN-002",
        descripcion: "Cambio de pastillas de freno delanteras",
      },
      {
        codigo: "FRN-003",
        descripcion: "Cambio de pastillas de freno traseras",
      },
      { codigo: "FRN-004", descripcion: "Rectificación de discos de freno" },
      { codigo: "FRN-005", descripcion: "Cambio de discos de freno" },
      {
        codigo: "FRN-006",
        descripcion: "Reparar bocamaza delantera izquierda",
      },
      { codigo: "FRN-007", descripcion: "Reparar bocamaza delantera derecha" },
      { codigo: "FRN-008", descripcion: "Purgar sistema de frenos" },
      { codigo: "FRN-009", descripcion: "Cambio de líquido de frenos" },

      // Motor
      { codigo: "MOT-001", descripcion: "Cambio de aceite de motor" },
      { codigo: "MOT-002", descripcion: "Cambio de filtro de aceite" },
      { codigo: "MOT-003", descripcion: "Cambio de filtro de aire" },
      { codigo: "MOT-004", descripcion: "Cambio de filtro de combustible" },
      { codigo: "MOT-005", descripcion: "Cambio de bujías" },
      { codigo: "MOT-006", descripcion: "Limpieza de inyectores" },
      { codigo: "MOT-007", descripcion: "Revisión de sistema de encendido" },
      { codigo: "MOT-008", descripcion: "Cambio de correa de distribución" },
      { codigo: "MOT-009", descripcion: "Cambio de correa de accesorios" },
      { codigo: "MOT-010", descripcion: "Cambio de bomba de agua" },

      // Transmisión
      { codigo: "TRN-001", descripcion: "Cambio de aceite de transmisión" },
      { codigo: "TRN-002", descripcion: "Revisión de embrague" },
      { codigo: "TRN-003", descripcion: "Cambio de kit de embrague" },
      { codigo: "TRN-004", descripcion: "Cambio de rodamiento de embrague" },

      // Suspensión
      { codigo: "SUS-001", descripcion: "Revisión de suspensión delantera" },
      { codigo: "SUS-002", descripcion: "Revisión de suspensión trasera" },
      { codigo: "SUS-003", descripcion: "Cambio de amortiguadores delanteros" },
      { codigo: "SUS-004", descripcion: "Cambio de amortiguadores traseros" },
      { codigo: "SUS-005", descripcion: "Cambio de muelles" },
      { codigo: "SUS-006", descripcion: "Cambio de rotulas" },
      { codigo: "SUS-007", descripcion: "Alineación y balanceo" },

      // Dirección
      { codigo: "DIR-001", descripcion: "Revisión de dirección" },
      {
        codigo: "DIR-002",
        descripcion: "Cambio de aceite de dirección hidráulica",
      },
      { codigo: "DIR-003", descripcion: "Cambio de terminales de dirección" },
      { codigo: "DIR-004", descripcion: "Cambio de barras de dirección" },

      // Sistema Eléctrico
      { codigo: "ELE-001", descripcion: "Revisión de sistema eléctrico" },
      { codigo: "ELE-002", descripcion: "Cambio de batería" },
      { codigo: "ELE-003", descripcion: "Cambio de alternador" },
      { codigo: "ELE-004", descripcion: "Cambio de motor de arranque" },
      { codigo: "ELE-005", descripcion: "Revisión de luces" },
      { codigo: "ELE-006", descripcion: "Cambio de focos delanteros" },
      { codigo: "ELE-007", descripcion: "Cambio de focos traseros" },

      // Refrigeración
      { codigo: "REF-001", descripcion: "Cambio de refrigerante" },
      {
        codigo: "REF-002",
        descripcion: "Revisión de sistema de refrigeración",
      },
      { codigo: "REF-003", descripcion: "Cambio de termostato" },
      { codigo: "REF-004", descripcion: "Cambio de radiador" },
      {
        codigo: "REF-005",
        descripcion: "Cambio de mangueras de refrigeración",
      },

      // Aire Acondicionado
      {
        codigo: "AAC-001",
        descripcion: "Recarga de gas de aire acondicionado",
      },
      {
        codigo: "AAC-002",
        descripcion: "Cambio de filtro de aire acondicionado",
      },
      { codigo: "AAC-003", descripcion: "Revisión de compresor de A/C" },

      // Neumáticos
      { codigo: "NEU-001", descripcion: "Rotación de neumáticos" },
      { codigo: "NEU-002", descripcion: "Cambio de neumáticos" },
      { codigo: "NEU-003", descripcion: "Reparación de pinchazo" },
      { codigo: "NEU-004", descripcion: "Revisión de presión de neumáticos" },

      // Carrocería
      { codigo: "CAR-001", descripcion: "Revisión de carrocería" },
      { codigo: "CAR-002", descripcion: "Reparación de abolladuras" },
      { codigo: "CAR-003", descripcion: "Cambio de parabrisas" },
      { codigo: "CAR-004", descripcion: "Cambio de espejos retrovisores" },
      { codigo: "CAR-005", descripcion: "Reparación de puertas" },

      // Escape
      { codigo: "ESC-001", descripcion: "Revisión de sistema de escape" },
      { codigo: "ESC-002", descripcion: "Cambio de silenciador" },
      { codigo: "ESC-003", descripcion: "Cambio de catalizador" },

      // Mantenimiento General
      { codigo: "GEN-001", descripcion: "Inspección general de vehículo" },
      { codigo: "GEN-002", descripcion: "Lavado de motor" },
      { codigo: "GEN-003", descripcion: "Engrase general" },
      { codigo: "GEN-004", descripcion: "Revisión pre-viaje" },
      { codigo: "GEN-005", descripcion: "Limpieza interior profunda" },
    ])
    .returning();

  console.log("✅ Tasks inserted:", tareasData.length);
  return tareasData;
}

import { database } from "@db/connection.db";
import { clienteDocumentos } from "@model/tables/cliente-documento.model";
import { Cliente } from "@model/tables/cliente.model";
import { getDate } from "@function/date.function";

const DEFAULT_PDF_URL =
  "https://res.cloudinary.com/dm0qhq2rk/image/upload/v1766044501/mantenimientos/Ejemplo%20de%20certificado_1766044500270.pdf";

// Helper to format Date to YYYY-MM-DD string
const formatDate = (date: Date): string => date.toISOString().split("T")[0];

export async function seedClienteDocumentos(clientesData: Cliente[]) {
  console.log("🌱 Seeding client documents...");

  if (clientesData.length === 0) {
    console.log("⚠️ Skipping client documents (no clients)");
    return;
  }

  const documentosData: Array<{
    clienteId: number;
    tipo:
      | "dni"
      | "ruc"
      | "contrato"
      | "carta_compromiso"
      | "ficha_ruc"
      | "otros";
    nombre: string;
    url: string;
    fechaExpiracion?: string;
    fechaEmision?: string;
  }> = [];

  // Track documents expiring soon (max 15 total across all seeders, allocate ~4 here)
  let expiringCount = 0;
  const maxExpiringSoon = 4;

  for (let i = 0; i < Math.min(clientesData.length, 10); i++) {
    const cliente = clientesData[i];

    // DNI - no expiration
    documentosData.push({
      clienteId: cliente.id,
      tipo: "dni",
      nombre: `DNI_${cliente.nombreCompleto}`,
      url: DEFAULT_PDF_URL,
      fechaEmision: formatDate(getDate(-365)),
    });

    // Contrato - some expiring soon for demo
    let contratoOffset: number;
    if (expiringCount < maxExpiringSoon && i < 4) {
      contratoOffset = i + 1; // 1, 2, 3, 4 days from now
      expiringCount++;
    } else {
      contratoOffset = 30 + i * 15; // 30, 45, 60, 75... days
    }
    documentosData.push({
      clienteId: cliente.id,
      tipo: "contrato",
      nombre: `Contrato_Servicio_${cliente.nombreCompleto}`,
      url: DEFAULT_PDF_URL,
      fechaEmision: formatDate(getDate(-180)),
      fechaExpiracion: formatDate(getDate(contratoOffset)),
    });

    // Carta compromiso - all valid with good margins
    if (i < 6) {
      documentosData.push({
        clienteId: cliente.id,
        tipo: "carta_compromiso",
        nombre: `Carta_Compromiso_${cliente.nombreCompleto}`,
        url: DEFAULT_PDF_URL,
        fechaEmision: formatDate(getDate(-90)),
        fechaExpiracion: formatDate(getDate(60 + i * 10)), // 60-110 days
      });
    }

    // RUC/Ficha RUC for business clients
    if (cliente.ruc) {
      documentosData.push({
        clienteId: cliente.id,
        tipo: "ficha_ruc",
        nombre: `Ficha_RUC_${cliente.ruc}`,
        url: DEFAULT_PDF_URL,
        fechaEmision: formatDate(getDate(-60)),
        fechaExpiracion: formatDate(getDate(120)), // Valid for 4 months
      });
    }
  }

  await database.insert(clienteDocumentos).values(documentosData);
  console.log(
    `✅ ${documentosData.length} client documents inserted (${expiringCount} expiring soon)`
  );
}

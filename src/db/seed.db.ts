import { seedConductores } from "@seed/conductor.seed";
import { seedMarcas } from "@seed/marca.seed";
import { seedModelos } from "@seed/modelo.seed";
import { seedVehiculos } from "@seed/vehiculo.seed";
import { seedRutas } from "@seed/ruta.seed";
import { seedMantenimientos } from "@seed/mantenimiento.seed";
import { seedTalleres } from "@seed/taller.seed";
import { seedViajes } from "@seed/viaje.seed";
import { seedUsuarios } from "@seed/usuario.seed";
import { seedClientes } from "@seed/cliente.seed";
import { seedClienteDocumentos } from "@seed/cliente-documento.seed";
import { seedConductorDocumentos } from "@seed/conductor-documento.seed";
import { seedVehiculoDocumentos } from "@seed/vehiculo-documento.seed";
import { seedUsuarioDocumentos } from "@seed/usuario-documento.seed";

async function seed() {
  try {
    console.log("🚀 Starting database seeding...\n");

    // Seeds must run in order due to foreign key dependencies
    // 1. Core entities
    const usuariosData = await seedUsuarios();
    const driversData = await seedConductores();
    const clientesData = await seedClientes();
    const marcasData = await seedMarcas();
    const modelosData = await seedModelos(marcasData);
    const routesData = await seedRutas();
    const talleresData = await seedTalleres();
    const vehiclesData = await seedVehiculos(modelosData);

    // 2. Related data
    await seedMantenimientos(vehiclesData, talleresData);
    await seedViajes(clientesData, routesData, vehiclesData, driversData);

    // 3. Documents (depend on core entities)
    await seedUsuarioDocumentos(usuariosData);
    await seedConductorDocumentos(driversData);
    await seedClienteDocumentos(clientesData);
    await seedVehiculoDocumentos(vehiclesData);

    console.log("\n✨ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();

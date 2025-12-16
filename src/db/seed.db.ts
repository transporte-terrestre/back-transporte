import { seedConductores } from "@seed/conductor.seed";
import { seedVehiculos } from "@seed/vehiculo.seed";
import { seedRutas } from "@seed/ruta.seed";
import { seedMantenimientos } from "@seed/mantenimiento.seed";
import { seedTalleres } from "@seed/taller.seed";
import { seedViajes } from "@seed/viaje.seed";
import { seedUsuarios } from "@seed/usuario.seed";
import { seedClientes } from "@seed/cliente.seed";

async function seed() {
  try {
    console.log("🚀 Starting database seeding...\n");

    // Seeds must run in order due to foreign key dependencies
    await seedUsuarios();
    await seedConductores();
    const clientesData = await seedClientes();
    const vehiclesData = await seedVehiculos();
    const routesData = await seedRutas();
    const talleresData = await seedTalleres();

    await seedMantenimientos(vehiclesData, talleresData);
    await seedViajes(clientesData, routesData);

    console.log("\n✨ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();

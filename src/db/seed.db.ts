import { seedConductores } from "@seeds/conductor.seed";
import { seedVehiculos } from "@seeds/vehiculo.seed";
import { seedRutas } from "@seeds/ruta.seed";
import { seedVehiculosConductores } from "@seeds/vehiculo-conductor.seed";
import { seedMantenimientos } from "@seeds/mantenimiento.seed";
import { seedViajes } from "@seeds/viaje.seed";
import { seedUsuarios } from "@seeds/usuario.seed";
import { seedClientes } from "@seeds/cliente.seed";

async function seed() {
  try {
    console.log("🚀 Starting database seeding...\n");

    // Seeds must run in order due to foreign key dependencies
    await seedUsuarios();
    await seedClientes();
    const driversData = await seedConductores();
    const vehiclesData = await seedVehiculos();
    const routesData = await seedRutas();

    await seedVehiculosConductores(driversData, vehiclesData);
    await seedMantenimientos(vehiclesData);
    await seedViajes(driversData, vehiclesData, routesData);

    console.log("\n✨ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();

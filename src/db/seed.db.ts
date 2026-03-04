import { seedPasajeros } from '@seed/pasajero.seed';
import { seedTallerSucursal } from '@seed/taller-sucursal.seed';

async function seed() {
  try {
    console.log('🚀 Starting database seeding (PASAJEROS ONLY)...\n');

    // Seeds must run in order due to foreign key dependencies
    // 1. Core entities
    // const usuariosData = await seedUsuarios();
    // const driversData = await seedConductores();
    // const clientesData = await seedClientes();
    // const propietariosData = await seedPropietarios();
    // const proveedoresData = await seedProveedores();
    // const marcasData = await seedMarcas();
    // const modelosData = await seedModelos(marcasData);
    // const routesData = await seedRutas();
    // const talleresData = await seedTalleres();
    // await seedTareas(); // Catálogo de tareas de mantenimiento
    // const vehiclesData = await seedVehiculos(modelosData);
    // await seedVehiculoPropietarios(vehiclesData, propietariosData);
    // await seedVehiculoProveedores(vehiclesData, proveedoresData);

    // 2. Related data
    // await seedMantenimientos(vehiclesData, talleresData);
    // await seedViajes(clientesData, routesData, vehiclesData, driversData);

    // 3. Documents (depend on core entities)
    // await seedUsuarioDocumentos(usuariosData);
    // await seedConductorDocumentos(driversData);
    // await seedClienteDocumentos(clientesData);
    // await seedPropietarioDocumentos(propietariosData);
    // await seedProveedorDocumentos(proveedoresData);
    // await seedVehiculoDocumentos(vehiclesData);

    // 4. Pasajeros
    // await seedPasajeros();

    // 5. Taller Sucursales
    await seedTallerSucursal();

    console.log('\n✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

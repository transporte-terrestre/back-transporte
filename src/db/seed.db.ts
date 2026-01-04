import { seedConductores } from '@seed/conductor.seed';
import { seedMarcas } from '@seed/marca.seed';
import { seedModelos } from '@seed/modelo.seed';
import { seedVehiculos } from '@seed/vehiculo.seed';
import { seedRutas } from '@seed/ruta.seed';
import { seedMantenimientos } from '@seed/mantenimiento.seed';
import { seedTalleres } from '@seed/taller.seed';
import { seedTareas } from '@seed/tarea.seed';
import { seedViajes } from '@seed/viaje.seed';
import { seedUsuarios } from '@seed/usuario.seed';
import { seedClientes } from '@seed/cliente.seed';
import { seedPropietarios } from '@seed/propietario.seed';
import { seedProveedores } from '@seed/proveedor.seed';
import { seedClienteDocumentos } from '@seed/cliente-documento.seed';
import { seedPropietarioDocumentos } from '@seed/propietario-documento.seed';
import { seedProveedorDocumentos } from '@seed/proveedor-documento.seed';
import { seedConductorDocumentos } from '@seed/conductor-documento.seed';
import { seedVehiculoDocumentos } from '@seed/vehiculo-documento.seed';
import { seedUsuarioDocumentos } from '@seed/usuario-documento.seed';
import { seedVehiculoPropietarios } from '@seed/vehiculo-propietario.seed';
import { seedVehiculoProveedores } from '@seed/vehiculo-proveedor.seed';

async function seed() {
  try {
    console.log('🚀 Starting database seeding...\n');

    // Seeds must run in order due to foreign key dependencies
    // 1. Core entities
    const usuariosData = await seedUsuarios();
    const driversData = await seedConductores();
    const clientesData = await seedClientes();
    const propietariosData = await seedPropietarios();
    const proveedoresData = await seedProveedores();
    const marcasData = await seedMarcas();
    const modelosData = await seedModelos(marcasData);
    const routesData = await seedRutas();
    const talleresData = await seedTalleres();
    await seedTareas(); // Catálogo de tareas de mantenimiento
    const vehiclesData = await seedVehiculos(modelosData);
    await seedVehiculoPropietarios(vehiclesData, propietariosData);
    await seedVehiculoProveedores(vehiclesData, proveedoresData);

    // 2. Related data
    await seedMantenimientos(vehiclesData, talleresData);
    await seedViajes(clientesData, routesData, vehiclesData, driversData);

    // 3. Documents (depend on core entities)
    await seedUsuarioDocumentos(usuariosData);
    await seedConductorDocumentos(driversData);
    await seedClienteDocumentos(clientesData);
    await seedPropietarioDocumentos(propietariosData);
    await seedProveedorDocumentos(proveedoresData);
    await seedVehiculoDocumentos(vehiclesData);

    console.log('\n✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

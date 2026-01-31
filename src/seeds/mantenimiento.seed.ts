import { database } from '@db/connection.db';
import { mantenimientos } from '@db/tables/mantenimiento.table';
import { Taller } from '@db/tables/taller.table';
import { Vehiculo } from '@db/tables/vehiculo.table';
import { getDate } from '@function/date.function';
import { eq, and, isNull, count } from 'drizzle-orm';

// Helper para generar codigoOrden: PLACA-00001
async function generarCodigoOrden(vehiculo: Vehiculo, contadorPorVehiculo: Map<number, number>): Promise<string> {
  const contador = (contadorPorVehiculo.get(vehiculo.id) || 0) + 1;
  contadorPorVehiculo.set(vehiculo.id, contador);
  const numeroFormateado = String(contador).padStart(5, '0');
  return `${vehiculo.placa}-${numeroFormateado}`;
}

export async function seedMantenimientos(vehiclesData: Vehiculo[], talleresData: Taller[]) {
  console.log('🌱 Seeding maintenances...');

  if (vehiclesData.length === 0) {
    console.log('⚠️ Skipping maintenances (no vehicles)');
    return;
  }

  if (talleresData.length === 0) {
    console.log('⚠️ Skipping maintenances (no workshops)');
    return;
  }

  const tallerExpress = talleresData.find((t) => t.nombreComercial === 'Taller Mecanico Express');
  const tallerMotor = talleresData.find((t) => t.nombreComercial === 'Motor Service Center');
  const tallerFrenos = talleresData.find((t) => t.nombreComercial === 'Frenos y Mas');

  // Contador de mantenimientos por vehículo para generar codigoOrden
  const contadorPorVehiculo = new Map<number, number>();

  // Datos de mantenimientos (sin codigoOrden, se genera automáticamente)
  const mantenimientosData = [
    {
      vehiculo: vehiclesData[0],
      taller: tallerExpress!,
      tipo: 'preventivo' as const,
      costo: '200.00',
      desc: 'Cambio de aceite y revision general',
      dias: -90,
      km: 45000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[1],
      taller: tallerMotor!,
      tipo: 'correctivo' as const,
      costo: '850.00',
      desc: 'Diagnostico y reparacion de motor',
      dias: -85,
      km: 52000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[2],
      taller: tallerFrenos!,
      tipo: 'correctivo' as const,
      costo: '1500.00',
      desc: 'Reemplazo de frenos',
      dias: -80,
      km: 78000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[3],
      taller: tallerExpress!,
      tipo: 'preventivo' as const,
      costo: '350.00',
      desc: 'Rotacion de neumaticos y alineacion',
      dias: -75,
      km: 19000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[4],
      taller: tallerMotor!,
      tipo: 'preventivo' as const,
      costo: '180.00',
      desc: 'Reemplazo de filtro de aire',
      dias: -70,
      km: 44000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[5],
      taller: tallerFrenos!,
      tipo: 'preventivo' as const,
      costo: '420.00',
      desc: 'Cambio de liquido de transmision',
      dias: -65,
      km: 69000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[6],
      taller: tallerExpress!,
      tipo: 'preventivo' as const,
      costo: '280.00',
      desc: 'Revision y reemplazo de bateria',
      dias: -60,
      km: 34000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[7],
      taller: tallerMotor!,
      tipo: 'correctivo' as const,
      costo: '650.00',
      desc: 'Reparacion de suspension',
      dias: -55,
      km: 54000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[8],
      taller: tallerFrenos!,
      tipo: 'correctivo' as const,
      costo: '920.00',
      desc: 'Reparacion de sistema de escape',
      dias: -50,
      km: 94000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[9],
      taller: tallerExpress!,
      tipo: 'preventivo' as const,
      costo: '250.00',
      desc: 'Cambio de bujias',
      dias: -45,
      km: 27000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[10],
      taller: tallerMotor!,
      tipo: 'preventivo' as const,
      costo: '320.00',
      desc: 'Revision de sistema de frenos',
      dias: -40,
      km: 14000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[11],
      taller: tallerFrenos!,
      tipo: 'correctivo' as const,
      costo: '780.00',
      desc: 'Reparacion de embrague',
      dias: -35,
      km: 47000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[12],
      taller: tallerExpress!,
      tipo: 'preventivo' as const,
      costo: '190.00',
      desc: 'Cambio de filtro de combustible',
      dias: -30,
      km: 31000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[13],
      taller: tallerMotor!,
      tipo: 'preventivo' as const,
      costo: '410.00',
      desc: 'Revision de sistema electrico',
      dias: -28,
      km: 74000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[14],
      taller: tallerFrenos!,
      tipo: 'correctivo' as const,
      costo: '1100.00',
      desc: 'Reparacion de caja de cambios',
      dias: -26,
      km: 51000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[15],
      taller: tallerExpress!,
      tipo: 'preventivo' as const,
      costo: '270.00',
      desc: 'Revision general de motor',
      dias: -24,
      km: 87000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[16],
      taller: tallerMotor!,
      tipo: 'preventivo' as const,
      costo: '330.00',
      desc: 'Cambio de correa de distribucion',
      dias: -22,
      km: 37000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[17],
      taller: tallerFrenos!,
      tipo: 'correctivo' as const,
      costo: '890.00',
      desc: 'Reparacion de direccion',
      dias: -20,
      km: 17000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[18],
      taller: tallerExpress!,
      tipo: 'preventivo' as const,
      costo: '220.00',
      desc: 'Cambio de liquido de frenos',
      dias: -18,
      km: 67000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[19],
      taller: tallerMotor!,
      tipo: 'preventivo' as const,
      costo: '380.00',
      desc: 'Revision de sistema de refrigeracion',
      dias: -16,
      km: 41000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[20],
      taller: tallerFrenos!,
      tipo: 'correctivo' as const,
      costo: '1200.00',
      desc: 'Reparacion de turbo',
      dias: -14,
      km: 24000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[21],
      taller: tallerExpress!,
      tipo: 'preventivo' as const,
      costo: '290.00',
      desc: 'Cambio de aceite de transmision',
      dias: -12,
      km: 57000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[22],
      taller: tallerMotor!,
      tipo: 'preventivo' as const,
      costo: '340.00',
      desc: 'Revision de amortiguadores',
      dias: -10,
      km: 71000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[23],
      taller: tallerFrenos!,
      tipo: 'correctivo' as const,
      costo: '950.00',
      desc: 'Reparacion de sistema de inyeccion',
      dias: -8,
      km: 11000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[24],
      taller: tallerExpress!,
      tipo: 'preventivo' as const,
      costo: '240.00',
      desc: 'Cambio de pastillas de freno',
      dias: -6,
      km: 35000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[25],
      taller: tallerMotor!,
      tipo: 'preventivo' as const,
      costo: '360.00',
      desc: 'Revision de sistema de escape',
      dias: -4,
      km: 61000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[26],
      taller: tallerFrenos!,
      tipo: 'correctivo' as const,
      costo: '1050.00',
      desc: 'Reparacion de motor',
      dias: -2,
      km: 77000,
      estado: 'finalizado' as const,
    },
    {
      vehiculo: vehiclesData[27],
      taller: tallerExpress!,
      tipo: 'preventivo' as const,
      costo: '310.00',
      desc: 'Cambio de filtros',
      dias: 0,
      km: 39000,
      estado: 'pendiente' as const,
    },
    {
      vehiculo: vehiclesData[28],
      taller: tallerMotor!,
      tipo: 'preventivo' as const,
      costo: '400.00',
      desc: 'Revision completa programada',
      dias: 5,
      km: 53000,
      estado: 'pendiente' as const,
    },
    {
      vehiculo: vehiclesData[29],
      taller: tallerFrenos!,
      tipo: 'preventivo' as const,
      costo: '260.00',
      desc: 'Mantenimiento preventivo general',
      dias: 10,
      km: 21000,
      estado: 'pendiente' as const,
    },
  ];

  // Insertar mantenimientos con codigoOrden generado
  for (const m of mantenimientosData) {
    const codigoOrden = await generarCodigoOrden(m.vehiculo, contadorPorVehiculo);

    // Calcular fechaSalida para mantenimientos finalizados (1-3 días después del ingreso)
    let fechaSalida: Date | undefined;
    if (m.estado === 'finalizado') {
      const diasDuracion = Math.floor(Math.random() * 3) + 1; // 1-3 días
      fechaSalida = getDate(m.dias + diasDuracion);
    }

    await database.insert(mantenimientos).values({
      vehiculoId: m.vehiculo.id,
      tallerId: m.taller.id,
      tipo: m.tipo,
      costoTotal: m.costo,
      descripcion: m.desc,
      fechaIngreso: getDate(m.dias),
      fechaSalida,
      kilometraje: m.km,
      estado: m.estado,
      codigoOrden,
    });
  }

  console.log('✅ Maintenances inserted with auto-generated codigoOrden (PLACA-00001)');
}

import { database } from '@db/connection.db';
import { viajes } from '@db/tables/viaje.model';
import { Ruta } from '@db/tables/ruta.model';
import { Cliente } from '@db/tables/cliente.model';
import { getDateTime } from '@function/date.function';

import { Conductor } from '@db/tables/conductor.model';
import { Vehiculo } from '@db/tables/vehiculo.model';
import { ViajeConductorDTO, viajeConductores } from '@db/tables/viaje-conductor.model';
import { ViajeVehiculoDTO, viajeVehiculos } from '@db/tables/viaje-vehiculo.model';

// Helper functions
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const modalidades = ['regular', 'expreso', 'ejecutivo', 'especial', 'turismo'] as const;
const estados = ['programado', 'en_progreso', 'completado'] as const;
const tripulantesPool = [
  'Carlos Mendoza',
  'Ana Torres',
  'Luis Ramírez',
  'Jorge Flores',
  'Patricia Díaz',
  'Miguel Soto',
  'Roberto Salas',
  'Sandra Vega',
  'Pedro Cruz',
  'Fernando Rojas',
  'Lucia Paredes',
  'Andrés Morales',
  'Carla Gutiérrez',
  'Diego Vargas',
  'Elena Castillo',
  'Raúl Jiménez',
  'Beatriz Núñez',
  'Francisco Reyes',
  'Gabriel Herrera',
  'Mariana López',
];

const rutasOcasionalesPool = [
  'Lima - Playa de Máncora (Viaje especial)',
  'Cusco - Valle Sagrado (Tour privado)',
  'Arequipa - Cañón del Colca (Excursión)',
  'Ica - Paracas (Servicio privado)',
  'Trujillo - Huanchaco (Tour playero)',
  'Lima - Lunahuaná (Aventura)',
  'Puno - Islas Flotantes (Tour lacustre)',
  'Nazca - Sobrevuelo Líneas de Nazca',
  'Chiclayo - Señor de Sipán (Cultural)',
  'Tarapoto - Cataratas de Ahuashiyacu',
];

export async function seedViajes(clientesData: Cliente[], routesData: Ruta[], vehiclesData: Vehiculo[], driversData: Conductor[]) {
  console.log('🌱 Seeding trips (enhanced with 3-5 per vehicle)...');

  if (clientesData.length === 0 || routesData.length === 0 || vehiclesData.length === 0 || driversData.length === 0) {
    console.log('⚠️ Skipping trips (missing dependencies)');
    return;
  }

  // We'll create 3-5 viajes per vehicle
  const viajesData: {
    rutaId?: number;
    rutaOcasional?: string;
    distanciaEstimada?: string;
    distanciaFinal?: string;
    tipoRuta: 'fija' | 'ocasional';
    clienteId: number;
    tripulantes: string[];
    modalidadServicio: (typeof modalidades)[number];
    horasContrato: string;
    fechaSalida: Date;
    fechaLlegada?: Date;
    estado: (typeof estados)[number];
  }[] = [];

  // Track which vehicle->driver->client assignments to make
  const assignments: { vehiculoId: number; conductorId: number }[] = [];

  for (let vehicleIdx = 0; vehicleIdx < vehiclesData.length; vehicleIdx++) {
    const vehicle = vehiclesData[vehicleIdx];
    const numTrips = randomInt(3, 5); // 3 to 5 trips per vehicle

    // Reset dayOffset for each vehicle, starting well in the past to ensure most are completed
    let dayOffset = randomInt(-90, -15); // Start between 90 and 15 days ago

    for (let tripNum = 0; tripNum < numTrips; tripNum++) {
      // Decide fixed or occasional route (80% fixed, 20% occasional)
      const isFixed = Math.random() < 0.8;

      // Pick random client
      const cliente = randomElement(clientesData);

      // Pick random conductor (different for variety)
      const conductor = driversData[(vehicleIdx + tripNum) % driversData.length];

      // Random time offset
      const hourStart = randomInt(6, 14);
      const tripDuration = randomInt(2, 14); // 2 to 14 hours

      // Decide estado based on day offset
      let estado: (typeof estados)[number];
      if (dayOffset < -1) {
        estado = 'completado';
      } else if (dayOffset <= 1) {
        estado = Math.random() < 0.3 ? 'en_progreso' : 'completado';
      } else {
        estado = 'programado';
      }

      // Random tripulantes (1-3)
      const numTripulantes = randomInt(1, 3);
      const tripulantes: string[] = [];
      for (let t = 0; t < numTripulantes; t++) {
        const tripulante = randomElement(tripulantesPool);
        if (!tripulantes.includes(tripulante)) {
          tripulantes.push(tripulante);
        }
      }

      // Determine distance based on route type
      let distanciaEstimadaNum: number;
      let selectedRuta: Ruta | undefined;

      if (isFixed) {
        // For fixed routes, get distance from the route
        selectedRuta = randomElement(routesData);
        distanciaEstimadaNum = parseFloat(selectedRuta.distancia);
      } else {
        // For occasional routes, generate random distance (100-800 km)
        distanciaEstimadaNum = randomInt(100, 800);
      }

      // Add small variation for final distance (-10 to +20 km)
      const variacion = randomInt(-10, 20);
      const distanciaFinalNum = distanciaEstimadaNum + variacion;

      const viajeEntry: (typeof viajesData)[0] = {
        tipoRuta: isFixed ? 'fija' : 'ocasional',
        clienteId: cliente.id,
        tripulantes,
        modalidadServicio: randomElement(modalidades),
        horasContrato: cliente.horasContrato || '0.00',
        fechaSalida: getDateTime(dayOffset, hourStart),
        estado,
        distanciaEstimada: distanciaEstimadaNum.toFixed(2),
      };

      if (isFixed && selectedRuta) {
        viajeEntry.rutaId = selectedRuta.id;
      } else {
        viajeEntry.rutaOcasional = randomElement(rutasOcasionalesPool);
      }

      // Add arrival time and final distance for completed trips
      if (estado === 'completado') {
        const llegadaDate = getDateTime(dayOffset, hourStart + tripDuration);
        viajeEntry.fechaLlegada = llegadaDate;
        viajeEntry.distanciaFinal = distanciaFinalNum.toFixed(2);
      }

      viajesData.push(viajeEntry);

      // Store the assignment
      assignments.push({
        vehiculoId: vehicle.id,
        conductorId: conductor.id,
      });

      // Move forward in time for variety
      dayOffset += randomInt(2, 7); // Bigger gaps between trips
    }
  }

  // Insert all viajes
  const insertedViajes = await database.insert(viajes).values(viajesData).returning({ id: viajes.id });

  console.log(`✅ ${insertedViajes.length} trips inserted. Assigning drivers and vehicles...`);

  // Create conductor and vehicle assignments
  const conductorInserts: ViajeConductorDTO[] = [];
  const vehiculoInserts: ViajeVehiculoDTO[] = [];

  insertedViajes.forEach((viaje, index) => {
    const assignment = assignments[index];

    conductorInserts.push({
      viajeId: viaje.id,
      conductorId: assignment.conductorId,
      esPrincipal: true,
      rol: 'conductor',
    });

    vehiculoInserts.push({
      viajeId: viaje.id,
      vehiculoId: assignment.vehiculoId,
      esPrincipal: true,
      rol: 'principal',
    });
  });

  if (conductorInserts.length > 0) {
    await database.insert(viajeConductores).values(conductorInserts);
  }

  if (vehiculoInserts.length > 0) {
    await database.insert(viajeVehiculos).values(vehiculoInserts);
  }

  console.log('✅ Trip assignments completed!');
}

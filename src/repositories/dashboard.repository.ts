import { Injectable } from '@nestjs/common';
import { database } from '@db/connection.db';
import { vehiculos } from '@db/tables/vehiculo.table';
import { conductores } from '@db/tables/conductor.table';
import { viajes } from '@db/tables/viaje.table';
import { mantenimientos } from '@db/tables/mantenimiento.table';
import { rutas } from '@db/tables/ruta.table';
import { viajeConductores } from '@db/tables/viaje-conductor.table';
import { viajeVehiculos } from '@db/tables/viaje-vehiculo.table';
import { clientes } from '@db/tables/cliente.table';
import { count, eq, gte, lte, and, desc, sql } from 'drizzle-orm';

@Injectable()
export class DashboardRepository {
  async countVehiculos() {
    const [{ total }] = await database.select({ total: count() }).from(vehiculos);
    return Number(total);
  }

  async countConductores() {
    const [{ total }] = await database.select({ total: count() }).from(conductores);
    return Number(total);
  }

  async countClientes() {
    const [{ total }] = await database.select({ total: count() }).from(clientes);
    return Number(total);
  }

  async countViajesHoy() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [{ count: total }] = await database
      .select({ count: count() })
      .from(viajes)
      .where(and(gte(viajes.fechaSalida, today), lte(viajes.fechaSalida, tomorrow)));

    return Number(total);
  }

  async getRecentTrips(limit: number = 5) {
    const result = await database
      .select({
        id: viajes.id,
        rutaId: viajes.rutaId,
        rutaOcasional: viajes.rutaOcasional,
        tipoRuta: viajes.tipoRuta,
        clienteId: viajes.clienteId,
        tripulantes: viajes.tripulantes,
        fechaSalida: viajes.fechaSalida,
        estado: viajes.estado,
      })
      .from(viajes)
      .orderBy(desc(viajes.fechaSalida))
      .limit(limit);

    // Provide enriched data (could be done via JOINs but Drizzle raw joins often easier than ORM object mapping for simple listing)
    // For now, mirroring logic from service but encapsulating DB access
    return await Promise.all(
      result.map(async (viaje) => {
        const ruta = viaje.rutaId ? await database.select().from(rutas).where(eq(rutas.id, viaje.rutaId)).limit(1) : [];

        const conductorPrincipal = await database
          .select({ conductorId: viajeConductores.conductorId })
          .from(viajeConductores)
          .where(and(eq(viajeConductores.viajeId, viaje.id), eq(viajeConductores.esPrincipal, true)))
          .limit(1);

        const conductor = conductorPrincipal.length
          ? await database.select().from(conductores).where(eq(conductores.id, conductorPrincipal[0].conductorId)).limit(1)
          : [];

        const vehiculoPrincipal = await database
          .select({ vehiculoId: viajeVehiculos.vehiculoId })
          .from(viajeVehiculos)
          .where(and(eq(viajeVehiculos.viajeId, viaje.id), eq(viajeVehiculos.esPrincipal, true)))
          .limit(1);

        const vehiculo = vehiculoPrincipal.length
          ? await database.select().from(vehiculos).where(eq(vehiculos.id, vehiculoPrincipal[0].vehiculoId)).limit(1)
          : [];

        return {
          ...viaje,
          rutaDetails: ruta[0],
          conductorDetails: conductor[0],
          vehiculoDetails: vehiculo[0],
        };
      }),
    );
  }

  async getUpcomingMaintenances(limit: number = 4) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 30);

    const result = await database
      .select({
        id: mantenimientos.id,
        vehiculoId: mantenimientos.vehiculoId,
        tipo: mantenimientos.tipo,
        fecha: mantenimientos.fechaIngreso,
        descripcion: mantenimientos.descripcion,
      })
      .from(mantenimientos)
      .where(and(gte(mantenimientos.fechaIngreso, today), lte(mantenimientos.fechaIngreso, futureDate)))
      .orderBy(mantenimientos.fechaIngreso)
      .limit(limit);

    return await Promise.all(
      result.map(async (m) => {
        const vehiculo = await database.select().from(vehiculos).where(eq(vehiculos.id, m.vehiculoId)).limit(1);
        return { ...m, vehiculoDetails: vehiculo[0] };
      }),
    );
  }

  async getVehiculosPorEstado() {
    return await database
      .select({
        estado: vehiculos.estado,
        cantidad: count(),
      })
      .from(vehiculos)
      .groupBy(vehiculos.estado);
  }

  async getRutasPopulares(limit: number = 5) {
    const result = await database
      .select({
        rutaId: viajes.rutaId,
        totalViajes: count(),
      })
      .from(viajes)
      .where(eq(viajes.tipoRuta, 'fija'))
      .groupBy(viajes.rutaId)
      .orderBy(desc(count()))
      .limit(limit);

    return await Promise.all(
      result.map(async (item) => {
        const ruta = await database.select().from(rutas).where(eq(rutas.id, item.rutaId)).limit(1);
        return {
          ...item,
          rutaDetails: ruta[0],
        };
      }),
    );
  }
}

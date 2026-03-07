
import { Injectable } from '@nestjs/common';
import { database } from '@db/connection.db';
import { viajeCircuitos, ViajeCircuitoDTO } from '@db/tables/viaje-circuito.table';
import { viajes } from '@db/tables/viaje.table';
import { viajeConductores } from '@db/tables/viaje-conductor.table';
import { viajeVehiculos } from '@db/tables/viaje-vehiculo.table';
import { eq, isNull, and, sql, count, desc, gte, lte, inArray, or } from 'drizzle-orm';

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
  modalidadServicio?: string;
  tipoRuta?: string;
  estado?: string;
  conductoresId?: number[];
  clienteId?: number;
  rutaId?: number;
  vehiculosId?: number[];
  sentido?: string;
  turno?: string;
}

@Injectable()
export class ViajeCircuitoRepository {
  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;
    const conditions: any[] = [isNull(viajeCircuitos.eliminadoEn)];

    if (filters?.search && !isNaN(Number(filters.search))) {
      conditions.push(eq(viajeCircuitos.id, Number(filters.search)));
    }

    const hasInnerFilters = !!(
      filters?.fechaInicio ||
      filters?.fechaFin ||
      filters?.modalidadServicio ||
      filters?.tipoRuta ||
      filters?.estado ||
      (filters?.conductoresId && filters.conductoresId.length > 0) ||
      filters?.clienteId ||
      filters?.rutaId ||
      (filters?.vehiculosId && filters.vehiculosId.length > 0) ||
      filters?.sentido ||
      filters?.turno
    );

    if (hasInnerFilters) {
      const tripConditions: any[] = [isNull(viajes.eliminadoEn)];

      if (filters?.modalidadServicio) {
        tripConditions.push(eq(sql`${viajes.modalidadServicio}::text`, filters.modalidadServicio));
      }
      if (filters?.tipoRuta) {
        tripConditions.push(eq(sql`${viajes.tipoRuta}::text`, filters.tipoRuta));
      }
      if (filters?.estado) {
        tripConditions.push(eq(sql`${viajes.estado}::text`, filters.estado));
      }
      if (filters?.fechaInicio && filters?.fechaFin) {
        tripConditions.push(gte(viajes.fechaSalidaProgramada, new Date(filters.fechaInicio)));
        tripConditions.push(lte(viajes.fechaSalidaProgramada, new Date(filters.fechaFin + 'T23:59:59')));
      } else if (filters?.fechaInicio) {
        tripConditions.push(gte(viajes.fechaSalidaProgramada, new Date(filters.fechaInicio)));
      } else if (filters?.fechaFin) {
        tripConditions.push(lte(viajes.fechaSalidaProgramada, new Date(filters.fechaFin + 'T23:59:59')));
      }
      if (filters?.clienteId) {
        tripConditions.push(eq(viajes.clienteId, filters.clienteId));
      }
      if (filters?.rutaId) {
        tripConditions.push(eq(viajes.rutaId, filters.rutaId));
      }
      if (filters?.sentido) {
        tripConditions.push(eq(sql`${viajes.sentido}::text`, filters.sentido));
      }
      if (filters?.turno) {
        tripConditions.push(eq(sql`${viajes.turno}::text`, filters.turno));
      }
      if (filters?.conductoresId && filters.conductoresId.length > 0) {
        const viajesConConductores = database
          .select({ viajeId: viajeConductores.viajeId })
          .from(viajeConductores)
          .where(inArray(viajeConductores.conductorId, filters.conductoresId));
        tripConditions.push(inArray(viajes.id, viajesConConductores));
      }
      if (filters?.vehiculosId && filters.vehiculosId.length > 0) {
        const viajesConVehiculo = database
          .select({ viajeId: viajeVehiculos.viajeId })
          .from(viajeVehiculos)
          .where(inArray(viajeVehiculos.vehiculoId, filters.vehiculosId));
        tripConditions.push(inArray(viajes.id, viajesConVehiculo));
      }

      const matchingTripsQuery = database
        .select({ id: viajes.id })
        .from(viajes)
        .where(and(...tripConditions));

      conditions.push(
        or(
          inArray(viajeCircuitos.viajeIdaId, matchingTripsQuery),
          inArray(viajeCircuitos.viajeVueltaId, matchingTripsQuery)
        )
      );
    }

    const whereClause = and(...conditions);

    // Total count
    const [{ total }] = await database.select({ total: count() }).from(viajeCircuitos).where(whereClause);

    // Paginated data
    const rows = await database.select().from(viajeCircuitos).where(whereClause).orderBy(desc(viajeCircuitos.creadoEn)).limit(limit).offset(offset);

    return { data: rows, total: Number(total) };
  }

  async findOne(id: number) {
    const [circuito] = await database
      .select()
      .from(viajeCircuitos)
      .where(and(eq(viajeCircuitos.id, id), isNull(viajeCircuitos.eliminadoEn)))
      .limit(1);

    if (!circuito) return null;

    let viajeIda = null;
    if (circuito.viajeIdaId) {
      const [ida] = await database
        .select()
        .from(viajes)
        .where(and(eq(viajes.id, circuito.viajeIdaId), isNull(viajes.eliminadoEn)));
      viajeIda = ida;
    }

    let viajeVuelta = null;
    if (circuito.viajeVueltaId) {
      const [vuelta] = await database
        .select()
        .from(viajes)
        .where(and(eq(viajes.id, circuito.viajeVueltaId), isNull(viajes.eliminadoEn)));
      viajeVuelta = vuelta;
    }

    return {
      id: circuito.id,
      viajeIdaId: circuito.viajeIdaId,
      viajeVueltaId: circuito.viajeVueltaId,
      creadoEn: circuito.creadoEn,
      viajeIda,
      viajeVuelta,
    };
  }

  async create(data: ViajeCircuitoDTO) {
    const result = await database.insert(viajeCircuitos).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<ViajeCircuitoDTO>) {
    const result = await database
      .update(viajeCircuitos)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(viajeCircuitos.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.update(viajeCircuitos).set({ eliminadoEn: new Date() }).where(eq(viajeCircuitos.id, id)).returning();
    return result[0];
  }

  async nullifyTripReference(viajeId: number) {
    // Si el viaje eliminado era ida
    await database.update(viajeCircuitos).set({ viajeIdaId: null, actualizadoEn: new Date() }).where(eq(viajeCircuitos.viajeIdaId, viajeId));

    // Si el viaje eliminado era vuelta
    await database.update(viajeCircuitos).set({ viajeVueltaId: null, actualizadoEn: new Date() }).where(eq(viajeCircuitos.viajeVueltaId, viajeId));

    // Si ambos son null, eliminar el circuito completo
    await database
      .update(viajeCircuitos)
      .set({ eliminadoEn: new Date() })
      .where(and(isNull(viajeCircuitos.viajeIdaId), isNull(viajeCircuitos.viajeVueltaId), isNull(viajeCircuitos.eliminadoEn)));
  }
}

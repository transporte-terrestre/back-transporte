import { Injectable } from '@nestjs/common';
import { database } from '@db/connection.db';
import { viajeCircuitos, ViajeCircuitoDTO } from '@db/tables/viaje-circuito.table';
import { viajes } from '@db/tables/viaje.table';
import { eq, isNull, and, like, count, desc, gte, lte } from 'drizzle-orm';

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

@Injectable()
export class ViajeCircuitoRepository {
  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;
    const conditions: any[] = [isNull(viajeCircuitos.eliminadoEn)];

    if (filters?.search && !isNaN(Number(filters.search))) {
      conditions.push(eq(viajeCircuitos.id, Number(filters.search)));
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(viajeCircuitos.creadoEn, new Date(filters.fechaInicio)));
      conditions.push(lte(viajeCircuitos.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    } else if (filters?.fechaInicio) {
      conditions.push(gte(viajeCircuitos.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(viajeCircuitos.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
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

import { Injectable } from '@nestjs/common';
import { eq, and, asc, isNull, sql, inArray } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { viajeTramos, ViajeTramoDTO } from '@db/tables/viaje-tramo.table';
import { viajePasajeroMovimientos } from '@db/tables/viaje-pasajero-movimiento.table';

@Injectable()
export class ViajeTramoRepository {
  async findByViajeId(viajeId: number) {
    return await database
      .select({
        id: viajeTramos.id,
        viajeId: viajeTramos.viajeId,
        tipo: viajeTramos.tipo,
        longitud: viajeTramos.longitud,
        latitud: viajeTramos.latitud,
        nombreLugar: viajeTramos.nombreLugar,
        horaFinal: viajeTramos.horaFinal,
        kilometrajeFinal: viajeTramos.kilometrajeFinal,
        numeroPasajeros: viajeTramos.numeroPasajeros,
        rutaParadaId: viajeTramos.rutaParadaId,
        creadoEn: viajeTramos.creadoEn,
        actualizadoEn: viajeTramos.actualizadoEn,
      })
      .from(viajeTramos)
      .where(and(eq(viajeTramos.viajeId, viajeId), isNull(viajeTramos.eliminadoEn)))
      .orderBy(asc(viajeTramos.horaFinal));
  }

  async findLastByViajeId(viajeId: number) {
    const result = await database
      .select()
      .from(viajeTramos)
      .where(and(eq(viajeTramos.viajeId, viajeId), isNull(viajeTramos.eliminadoEn)))
      .orderBy(sql`creado_en DESC`)
      .limit(1);
    return result[0] || null;
  }

  async findByViajeIdWithParadas(viajeId: number) {
    const tramos = await this.findByViajeId(viajeId);
    return tramos;
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(viajeTramos)
      .where(and(eq(viajeTramos.id, id), isNull(viajeTramos.eliminadoEn)));
    return result[0];
  }

  async create(data: ViajeTramoDTO) {
    const result = await database.insert(viajeTramos).values(data).returning();
    return result[0];
  }

  async createMany(data: ViajeTramoDTO[]) {
    const result = await database.insert(viajeTramos).values(data).returning();
    return result;
  }

  async update(id: number, data: Partial<ViajeTramoDTO>) {
    const result = await database
      .update(viajeTramos)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(viajeTramos.id, id))
      .returning();
    return result[0];
  }

  async syncNumeroPasajeros(id: number) {
    return await database
      .update(viajeTramos)
      .set({
        numeroPasajeros: sql`(
          SELECT count(*)
          FROM ${viajePasajeroMovimientos}
          WHERE ${viajePasajeroMovimientos.viajeTramoId} = ${viajeTramos.id}
            AND ${viajePasajeroMovimientos.tipoMovimiento} = 'entrada'
            AND ${viajePasajeroMovimientos.eliminadoEn} IS NULL
        )`,
        actualizadoEn: new Date(),
      })
      .where(eq(viajeTramos.id, id));
  }

  /**
   * Recalcula numeroPasajeros como total acumulado (entradas - salidas)
   * hasta cada tramo, para TODOS los tramos del viaje.
   */
  async syncAllNumeroPasajeros(viajeId: number) {
    const tramos = await database
      .select({ id: viajeTramos.id })
      .from(viajeTramos)
      .where(and(eq(viajeTramos.viajeId, viajeId), isNull(viajeTramos.eliminadoEn)))
      .orderBy(asc(viajeTramos.horaFinal));

    if (tramos.length === 0) return;

    const movCounts = await database
      .select({
        viajeTramoId: viajePasajeroMovimientos.viajeTramoId,
        tipoMovimiento: viajePasajeroMovimientos.tipoMovimiento,
        total: sql<number>`count(*)`.mapWith(Number),
      })
      .from(viajePasajeroMovimientos)
      .where(
        and(
          inArray(
            viajePasajeroMovimientos.viajeTramoId,
            tramos.map((t) => t.id),
          ),
          isNull(viajePasajeroMovimientos.eliminadoEn),
        ),
      )
      .groupBy(viajePasajeroMovimientos.viajeTramoId, viajePasajeroMovimientos.tipoMovimiento);

    const deltaMap = new Map<number, number>();
    for (const m of movCounts) {
      const current = deltaMap.get(m.viajeTramoId) || 0;
      deltaMap.set(m.viajeTramoId, current + (m.tipoMovimiento === 'entrada' ? m.total : -m.total));
    }

    let running = 0;
    for (const tramo of tramos) {
      running += deltaMap.get(tramo.id) || 0;
      await database.update(viajeTramos).set({ numeroPasajeros: running, actualizadoEn: new Date() }).where(eq(viajeTramos.id, tramo.id));
    }
  }

  async delete(id: number) {
    const result = await database.update(viajeTramos).set({ eliminadoEn: new Date() }).where(eq(viajeTramos.id, id)).returning();
    return result[0];
  }

  async deleteByViajeId(viajeId: number) {
    const result = await database.update(viajeTramos).set({ eliminadoEn: new Date() }).where(eq(viajeTramos.viajeId, viajeId)).returning();
    return result;
  }
}

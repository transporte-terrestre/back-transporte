import { Injectable } from '@nestjs/common';
import { eq, and, asc, isNull, sql, inArray } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { viajeTramos, ViajeTramoDTO } from '@db/tables/viaje-tramo.table';
import { viajePasajeroMovimientos } from '@db/tables/viaje-pasajero-movimiento.table';
import { vehiculoAbastecimientos } from '@db/tables/vehiculo-abastecimiento.table';

type ViajeTramoBase = {
  id: number;
  viajeId: number;
  tipo: 'origen' | 'punto' | 'parada' | 'descanso' | 'destino';
  longitud: number | null;
  latitud: number | null;
  nombreLugar: string | null;
  horaFinal: Date | null;
  kilometrajeFinal: number | null;
  rutaParadaId: number | null;
  creadoEn: Date;
  actualizadoEn: Date;
};

@Injectable()
export class ViajeTramoRepository {
  async findByViajeId(viajeId: number) {
    const tramos = await database
      .select({
        id: viajeTramos.id,
        viajeId: viajeTramos.viajeId,
        tipo: viajeTramos.tipo,
        longitud: viajeTramos.longitud,
        latitud: viajeTramos.latitud,
        nombreLugar: viajeTramos.nombreLugar,
        horaFinal: viajeTramos.horaFinal,
        kilometrajeFinal: viajeTramos.kilometrajeFinal,
        rutaParadaId: viajeTramos.rutaParadaId,
        creadoEn: viajeTramos.creadoEn,
        actualizadoEn: viajeTramos.actualizadoEn,
      })
      .from(viajeTramos)
      .where(and(eq(viajeTramos.viajeId, viajeId), isNull(viajeTramos.eliminadoEn)))
      .orderBy(asc(viajeTramos.horaFinal));

    return await this.attachComputedData(tramos);
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
      .select({
        id: viajeTramos.id,
        viajeId: viajeTramos.viajeId,
        tipo: viajeTramos.tipo,
        longitud: viajeTramos.longitud,
        latitud: viajeTramos.latitud,
        nombreLugar: viajeTramos.nombreLugar,
        horaFinal: viajeTramos.horaFinal,
        kilometrajeFinal: viajeTramos.kilometrajeFinal,
        rutaParadaId: viajeTramos.rutaParadaId,
        creadoEn: viajeTramos.creadoEn,
        actualizadoEn: viajeTramos.actualizadoEn,
      })
      .from(viajeTramos)
      .where(and(eq(viajeTramos.id, id), isNull(viajeTramos.eliminadoEn)));
    const tramo = result[0];
    if (!tramo) return null;
    const tramos = await this.findByViajeId(tramo.viajeId);
    return tramos.find((item) => item.id === id) || null;
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
    return await this.findOne(id);
  }

  /**
   * El contador de pasajeros ya no se persiste en viaje_tramos.
   * Se calcula al consultar a partir de viaje_pasajero_movimientos.
   */
  async syncAllNumeroPasajeros(viajeId: number) {
    return await this.findByViajeId(viajeId);
  }

  private async attachComputedData(tramos: ViajeTramoBase[]) {
    if (tramos.length === 0) return [];

    const tramoIds = tramos.map((tramo) => tramo.id);
    const movCounts = await database
      .select({
        viajeTramoId: viajePasajeroMovimientos.viajeTramoId,
        tipoMovimiento: viajePasajeroMovimientos.tipoMovimiento,
        total: sql<number>`count(*)`.mapWith(Number),
      })
      .from(viajePasajeroMovimientos)
      .where(
        and(
          inArray(viajePasajeroMovimientos.viajeTramoId, tramoIds),
          isNull(viajePasajeroMovimientos.eliminadoEn),
        ),
      )
      .groupBy(viajePasajeroMovimientos.viajeTramoId, viajePasajeroMovimientos.tipoMovimiento);

    const repostajeTotals = await database
      .select({
        viajeTramoId: vehiculoAbastecimientos.viajeTramoId,
        total: sql<number>`COALESCE(SUM(CAST(${vehiculoAbastecimientos.galonesEstablecidos} AS DECIMAL)), 0)`.mapWith(Number),
      })
      .from(vehiculoAbastecimientos)
      .where(
        and(
          inArray(vehiculoAbastecimientos.viajeTramoId, tramoIds),
          isNull(vehiculoAbastecimientos.eliminadoEn),
        ),
      )
      .groupBy(vehiculoAbastecimientos.viajeTramoId);

    const deltaMap = new Map<number, number>();
    for (const m of movCounts) {
      const current = deltaMap.get(m.viajeTramoId) || 0;
      deltaMap.set(m.viajeTramoId, current + (m.tipoMovimiento === 'entrada' ? m.total : -m.total));
    }

    const galonesMap = new Map<number, number>();
    for (const repostaje of repostajeTotals) {
      if (repostaje.viajeTramoId !== null) {
        galonesMap.set(repostaje.viajeTramoId, repostaje.total);
      }
    }

    let running = 0;
    return tramos.map((tramo) => {
      running += deltaMap.get(tramo.id) || 0;
      return {
        ...tramo,
        numeroPasajeros: tramo.tipo === 'descanso' ? null : running,
        galonesAbastecidos: Number((galonesMap.get(tramo.id) || 0).toFixed(2)),
      };
    });
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

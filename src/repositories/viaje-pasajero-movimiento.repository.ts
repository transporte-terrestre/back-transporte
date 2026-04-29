import { Injectable } from '@nestjs/common';
import { eq, and, isNull, asc } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { viajePasajeroMovimientos, ViajePasajeroMovimientoDTO } from '@db/tables/viaje-pasajero-movimiento.table';
import { viajeTramos } from '@db/tables/viaje-tramo.table';

@Injectable()
export class ViajePasajeroMovimientoRepository {
  async create(data: ViajePasajeroMovimientoDTO) {
    const [newItem] = await database.insert(viajePasajeroMovimientos).values(data).returning();
    return newItem;
  }

  async findByViajeTramo(viajeTramoId: number) {
    return await database
      .select()
      .from(viajePasajeroMovimientos)
      .where(and(eq(viajePasajeroMovimientos.viajeTramoId, viajeTramoId), isNull(viajePasajeroMovimientos.eliminadoEn)));
  }

  async findByViajePasajero(viajePasajeroId: number) {
    return await database
      .select()
      .from(viajePasajeroMovimientos)
      .where(and(eq(viajePasajeroMovimientos.viajePasajeroId, viajePasajeroId), isNull(viajePasajeroMovimientos.eliminadoEn)));
  }

  async delete(id: number) {
    const [deletedItem] = await database
      .update(viajePasajeroMovimientos)
      .set({ eliminadoEn: new Date() })
      .where(eq(viajePasajeroMovimientos.id, id))
      .returning();
    return deletedItem;
  }

  async findByViajeId(viajeId: number) {
    return await database
      .select({
        id: viajePasajeroMovimientos.id,
        viajePasajeroId: viajePasajeroMovimientos.viajePasajeroId,
        viajeTramoId: viajePasajeroMovimientos.viajeTramoId,
        tipoMovimiento: viajePasajeroMovimientos.tipoMovimiento,
        paradaNombre: viajeTramos.nombreLugar,
        tramoHoraFinal: viajeTramos.horaFinal,
        hora: viajePasajeroMovimientos.hora,
      })
      .from(viajePasajeroMovimientos)
      .innerJoin(viajeTramos, eq(viajePasajeroMovimientos.viajeTramoId, viajeTramos.id))
      .where(and(eq(viajeTramos.viajeId, viajeId), isNull(viajePasajeroMovimientos.eliminadoEn)))
      .orderBy(asc(viajePasajeroMovimientos.hora));
  }
}

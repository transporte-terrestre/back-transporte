import { Injectable } from '@nestjs/common';
import { eq, and, isNull } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { viajeRepostajeMovimientos, ViajeRepostajeMovimientoDTO } from '@db/tables/viaje-repostaje-movimiento.table';

@Injectable()
export class ViajeRepostajeMovimientoRepository {
  async create(data: ViajeRepostajeMovimientoDTO) {
    const [newItem] = await database.insert(viajeRepostajeMovimientos).values(data).returning();
    return newItem;
  }

  async findByViajeTramo(viajeTramoId: number) {
    return await database
      .select()
      .from(viajeRepostajeMovimientos)
      .where(and(eq(viajeRepostajeMovimientos.viajeTramoId, viajeTramoId), isNull(viajeRepostajeMovimientos.eliminadoEn)));
  }

  async delete(id: number) {
    const [deletedItem] = await database
      .update(viajeRepostajeMovimientos)
      .set({ eliminadoEn: new Date() })
      .where(eq(viajeRepostajeMovimientos.id, id))
      .returning();
    return deletedItem;
  }

  async deleteByViajeTramo(viajeTramoId: number) {
    const deletedItems = await database
      .update(viajeRepostajeMovimientos)
      .set({ eliminadoEn: new Date() })
      .where(and(eq(viajeRepostajeMovimientos.viajeTramoId, viajeTramoId), isNull(viajeRepostajeMovimientos.eliminadoEn)))
      .returning();
    return deletedItems;
  }
}

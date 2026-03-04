import { Injectable } from '@nestjs/common';
import { eq, or, like, and, gte, lte, count, ilike, desc, isNull } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { rutaParadas, RutaParadaDTO } from '@db/tables/ruta-parada.table';

@Injectable()
export class RutaParadaRepository {
  async findAllByRutaId(rutaId: number) {
    return await database
      .select()
      .from(rutaParadas)
      .where(and(eq(rutaParadas.rutaId, rutaId), isNull(rutaParadas.eliminadoEn)))
      .orderBy(rutaParadas.orden);
  }

  async create(data: RutaParadaDTO) {
    const result = await database.insert(rutaParadas).values(data).returning();
    return result[0];
  }

  async createMany(data: RutaParadaDTO[]) {
    if (!data.length) return [];

    // Check if duplicate inserts can be handled by batching
    const result = await database.insert(rutaParadas).values(data).returning();
    return result;
  }

  async update(id: number, data: Partial<RutaParadaDTO>) {
    const result = await database
      .update(rutaParadas)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(rutaParadas.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.update(rutaParadas).set({ eliminadoEn: new Date() }).where(eq(rutaParadas.id, id)).returning();
    return result[0];
  }

  async deleteByRutaId(rutaId: number) {
    await database
      .update(rutaParadas)
      .set({ eliminadoEn: new Date() })
      .where(and(eq(rutaParadas.rutaId, rutaId), isNull(rutaParadas.eliminadoEn)));
  }
}

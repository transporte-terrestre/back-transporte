import { Injectable } from '@nestjs/common';
import { eq, and, ilike, asc, isNull } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { rutaParadas, RutaParadaDTO } from '@db/tables/ruta-parada.table';

@Injectable()
export class RutaParadaRepository {
  async findByRutaId(rutaId: number) {
    return await database
      .select()
      .from(rutaParadas)
      .where(and(eq(rutaParadas.rutaId, rutaId), isNull(rutaParadas.eliminadoEn)))
      .orderBy(asc(rutaParadas.orden));
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(rutaParadas)
      .where(and(eq(rutaParadas.id, id), isNull(rutaParadas.eliminadoEn)));
    return result[0];
  }

  async search(rutaId: number, searchTerm: string) {
    return await database
      .select()
      .from(rutaParadas)
      .where(and(eq(rutaParadas.rutaId, rutaId), ilike(rutaParadas.nombre, `%${searchTerm}%`), isNull(rutaParadas.eliminadoEn)))
      .orderBy(asc(rutaParadas.orden));
  }

  async create(data: RutaParadaDTO) {
    const result = await database.insert(rutaParadas).values(data).returning();
    return result[0];
  }

  async createMany(data: RutaParadaDTO[]) {
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

  async getMaxOrden(rutaId: number): Promise<number> {
    const result = await database
      .select({ orden: rutaParadas.orden })
      .from(rutaParadas)
      .where(and(eq(rutaParadas.rutaId, rutaId), isNull(rutaParadas.eliminadoEn)))
      .orderBy(asc(rutaParadas.orden));

    if (result.length === 0) return 0;
    return Math.max(...result.map((r) => r.orden));
  }

  async reordenar(rutaId: number, paradasOrdenadas: { id: number; orden: number }[]) {
    const resultados = [];
    for (const parada of paradasOrdenadas) {
      const result = await database
        .update(rutaParadas)
        .set({ orden: parada.orden, actualizadoEn: new Date() })
        .where(and(eq(rutaParadas.id, parada.id), eq(rutaParadas.rutaId, rutaId)))
        .returning();
      resultados.push(result[0]);
    }
    return resultados;
  }
}

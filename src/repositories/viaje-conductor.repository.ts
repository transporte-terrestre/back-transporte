import { Injectable } from "@nestjs/common";
import { eq, and, count } from "drizzle-orm";
import { database } from "@db/connection.db";
import { viajeConductores, ViajeConductorDTO } from "@db/tables/viaje-conductor.model";

@Injectable()
export class ViajeConductorRepository {
  async findAll() {
    return await database.select().from(viajeConductores);
  }

  async findAllPaginated(page: number = 1, limit: number = 10, filters?: { viajeId?: number; conductorId?: number }) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.viajeId) {
      conditions.push(eq(viajeConductores.viajeId, filters.viajeId));
    }

    if (filters?.conductorId) {
      conditions.push(eq(viajeConductores.conductorId, filters.conductorId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database
      .select({ total: count() })
      .from(viajeConductores)
      .where(whereClause);

    const data = await database
      .select()
      .from(viajeConductores)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    return { data, total: Number(total) };
  }

  async findOne(viajeId: number, conductorId: number) {
    const result = await database
      .select()
      .from(viajeConductores)
      .where(and(eq(viajeConductores.viajeId, viajeId), eq(viajeConductores.conductorId, conductorId)));
    return result[0];
  }

  async findByViajeId(viajeId: number) {
    return await database.select().from(viajeConductores).where(eq(viajeConductores.viajeId, viajeId));
  }

  async findByConductorId(conductorId: number) {
    return await database.select().from(viajeConductores).where(eq(viajeConductores.conductorId, conductorId));
  }

  async create(data: ViajeConductorDTO) {
    const result = await database.insert(viajeConductores).values(data).returning();
    return result[0];
  }

  async update(viajeId: number, conductorId: number, data: Partial<ViajeConductorDTO>) {
    const result = await database
      .update(viajeConductores)
      .set({ ...data, actualizadoEn: new Date() })
      .where(and(eq(viajeConductores.viajeId, viajeId), eq(viajeConductores.conductorId, conductorId)))
      .returning();
    return result[0];
  }

  async delete(viajeId: number, conductorId: number) {
    const result = await database
      .delete(viajeConductores)
      .where(and(eq(viajeConductores.viajeId, viajeId), eq(viajeConductores.conductorId, conductorId)))
      .returning();
    return result[0];
  }
}

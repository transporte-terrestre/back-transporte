import { Injectable } from "@nestjs/common";
import { eq, and, count } from "drizzle-orm";
import { database } from "@db/connection.db";
import { viajeComentarios, ViajeComentarioDTO } from "@db/tables/viaje-comentario.model";

@Injectable()
export class ViajeComentarioRepository {
  async findAll() {
    return await database.select().from(viajeComentarios);
  }

  async findAllPaginated(page: number = 1, limit: number = 10, filters?: { viajeId?: number; usuarioId?: number; tipo?: string }) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.viajeId) {
      conditions.push(eq(viajeComentarios.viajeId, filters.viajeId));
    }

    if (filters?.usuarioId) {
      conditions.push(eq(viajeComentarios.usuarioId, filters.usuarioId));
    }

    if (filters?.tipo) {
      conditions.push(eq(viajeComentarios.tipo, filters.tipo as any));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database
      .select({ total: count() })
      .from(viajeComentarios)
      .where(whereClause);

    const data = await database
      .select()
      .from(viajeComentarios)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    return { data, total: Number(total) };
  }

  async findOne(id: number) {
    const result = await database.select().from(viajeComentarios).where(eq(viajeComentarios.id, id));
    return result[0];
  }

  async findByViajeId(viajeId: number) {
    return await database.select().from(viajeComentarios).where(eq(viajeComentarios.viajeId, viajeId));
  }

  async findByUsuarioId(usuarioId: number) {
    return await database.select().from(viajeComentarios).where(eq(viajeComentarios.usuarioId, usuarioId));
  }

  async create(data: ViajeComentarioDTO) {
    const result = await database.insert(viajeComentarios).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<ViajeComentarioDTO>) {
    const result = await database
      .update(viajeComentarios)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(viajeComentarios.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.delete(viajeComentarios).where(eq(viajeComentarios.id, id)).returning();
    return result[0];
  }
}

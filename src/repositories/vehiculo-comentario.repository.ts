import { Injectable } from '@nestjs/common';
import { eq, and, count, getTableColumns, desc } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { vehiculoComentarios, VehiculoComentarioDTO, VehiculoComentarioTipo } from '@db/tables/vehiculo-comentario.table';
import { usuarios } from '@db/tables/usuario.table';

@Injectable()
export class VehiculoComentarioRepository {
  async findAll() {
    return await database.select().from(vehiculoComentarios);
  }

  async findAllPaginated(page: number = 1, limit: number = 10, filters?: { vehiculoId?: number; usuarioId?: number; tipo?: VehiculoComentarioTipo }) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.vehiculoId) {
      conditions.push(eq(vehiculoComentarios.vehiculoId, filters.vehiculoId));
    }

    if (filters?.usuarioId) {
      conditions.push(eq(vehiculoComentarios.usuarioId, filters.usuarioId));
    }

    if (filters?.tipo) {
      conditions.push(eq(vehiculoComentarios.tipo, filters.tipo));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database.select({ total: count() }).from(vehiculoComentarios).where(whereClause);

    const data = await database.select().from(vehiculoComentarios).where(whereClause).limit(limit).offset(offset);

    return { data, total: Number(total) };
  }

  async findOne(id: number) {
    const result = await database.select().from(vehiculoComentarios).where(eq(vehiculoComentarios.id, id));
    return result[0];
  }

  async findByVehiculoId(vehiculoId: number) {
    return await database
      .select({
        ...getTableColumns(vehiculoComentarios),
        usuarioNombreCompleto: usuarios.nombreCompleto,
      })
      .from(vehiculoComentarios)
      .leftJoin(usuarios, eq(usuarios.id, vehiculoComentarios.usuarioId))
      .where(eq(vehiculoComentarios.vehiculoId, vehiculoId))
      .orderBy(desc(vehiculoComentarios.creadoEn));
  }

  async findByUsuarioId(usuarioId: number) {
    return await database.select().from(vehiculoComentarios).where(eq(vehiculoComentarios.usuarioId, usuarioId));
  }

  async create(data: VehiculoComentarioDTO) {
    const result = await database.insert(vehiculoComentarios).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<VehiculoComentarioDTO>) {
    const result = await database
      .update(vehiculoComentarios)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(vehiculoComentarios.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.delete(vehiculoComentarios).where(eq(vehiculoComentarios.id, id)).returning();
    return result[0];
  }
}

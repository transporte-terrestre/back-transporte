import { Injectable } from '@nestjs/common';
import { eq, and, gte, lte, count } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { usuarioDocumentos, UsuarioDocumentoDTO } from '@db/tables/usuario-documento.model';

interface PaginationFilters {
  usuarioId?: number;
  tipo?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

@Injectable()
export class UsuarioDocumentoRepository {
  async findAll() {
    return await database.select().from(usuarioDocumentos);
  }

  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.usuarioId) {
      conditions.push(eq(usuarioDocumentos.usuarioId, filters.usuarioId));
    }

    if (filters?.tipo) {
      conditions.push(eq(usuarioDocumentos.tipo, filters.tipo as any));
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(usuarioDocumentos.creadoEn, new Date(filters.fechaInicio)));
      conditions.push(lte(usuarioDocumentos.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    } else if (filters?.fechaInicio) {
      conditions.push(gte(usuarioDocumentos.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(usuarioDocumentos.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database.select({ total: count() }).from(usuarioDocumentos).where(whereClause);

    const data = await database.select().from(usuarioDocumentos).where(whereClause).limit(limit).offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database.select().from(usuarioDocumentos).where(eq(usuarioDocumentos.id, id));
    return result[0];
  }

  async findByUsuarioId(usuarioId: number) {
    return await database.select().from(usuarioDocumentos).where(eq(usuarioDocumentos.usuarioId, usuarioId));
  }

  async create(data: UsuarioDocumentoDTO) {
    const result = await database.insert(usuarioDocumentos).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<UsuarioDocumentoDTO>) {
    const result = await database
      .update(usuarioDocumentos)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(usuarioDocumentos.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.delete(usuarioDocumentos).where(eq(usuarioDocumentos.id, id)).returning();
    return result[0];
  }
}

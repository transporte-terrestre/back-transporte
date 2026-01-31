import { Injectable } from '@nestjs/common';
import { eq, or, like, and, gte, lte, count, ilike, desc, isNull } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { rutas, RutaDTO } from '@db/tables/ruta.table';

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

@Injectable()
export class RutaRepository {
  async findAll() {
    return await database.select().from(rutas);
  }

  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.search) {
      const searchTerm = filters.search.trim();
      conditions.push(or(ilike(rutas.origen, `%${searchTerm}%`), ilike(rutas.destino, `%${searchTerm}%`)));
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(rutas.creadoEn, new Date(filters.fechaInicio)));
      conditions.push(lte(rutas.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    } else if (filters?.fechaInicio) {
      conditions.push(gte(rutas.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(rutas.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    }

    // Excluir eliminados
    conditions.push(isNull(rutas.eliminadoEn));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database.select({ total: count() }).from(rutas).where(whereClause);

    const data = await database.select().from(rutas).where(whereClause).orderBy(desc(rutas.creadoEn)).limit(limit).offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(rutas)
      .where(and(eq(rutas.id, id), isNull(rutas.eliminadoEn)));
    return result[0];
  }

  async create(data: RutaDTO) {
    const result = await database.insert(rutas).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<RutaDTO>) {
    const result = await database
      .update(rutas)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(rutas.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.update(rutas).set({ eliminadoEn: new Date() }).where(eq(rutas.id, id)).returning();
    return result[0];
  }
}

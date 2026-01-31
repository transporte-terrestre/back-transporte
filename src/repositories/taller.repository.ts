import { Injectable } from '@nestjs/common';
import { eq, or, like, and, gte, lte, count, ilike, desc, sql } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { talleres, TallerDTO } from '@db/tables/taller.model';

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
  tipo?: string;
}

@Injectable()
export class TallerRepository {
  async findAll() {
    return await database.select().from(talleres);
  }

  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.search) {
      const searchTerm = filters.search.trim();
      conditions.push(
        or(
          ilike(talleres.razonSocial, `%${searchTerm}%`),
          ilike(talleres.nombreComercial, `%${searchTerm}%`),
          like(talleres.ruc, `%${searchTerm}%`),
          like(talleres.telefono, `%${searchTerm}%`),
          like(talleres.email, `%${searchTerm}%`),
        ),
      );
    }

    if (filters?.tipo) {
      conditions.push(eq(sql`${talleres.tipo}::text`, filters.tipo));
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(talleres.creadoEn, new Date(filters.fechaInicio)));
      conditions.push(lte(talleres.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    } else if (filters?.fechaInicio) {
      conditions.push(gte(talleres.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(talleres.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database.select({ total: count() }).from(talleres).where(whereClause);

    const data = await database.select().from(talleres).where(whereClause).orderBy(desc(talleres.creadoEn)).limit(limit).offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database.select().from(talleres).where(eq(talleres.id, id));
    return result[0];
  }

  async create(data: TallerDTO) {
    const result = await database.insert(talleres).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<TallerDTO>) {
    const result = await database
      .update(talleres)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(talleres.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.delete(talleres).where(eq(talleres.id, id)).returning();
    return result[0];
  }
}

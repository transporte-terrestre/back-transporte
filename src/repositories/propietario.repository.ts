import { Injectable } from '@nestjs/common';
import { database } from '@db/connection.db';
import { propietarios, Propietario, PropietarioDTO } from '@db/tables/propietario.table';
import { eq, sql, count, or, like, and, gte, lte, ilike, desc, isNull } from 'drizzle-orm';

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
  tipoDocumento?: string;
}

@Injectable()
export class PropietarioRepository {
  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.search) {
      const searchTerm = filters.search.trim();
      conditions.push(
        or(
          ilike(propietarios.nombreCompleto, `%${searchTerm}%`),
          like(propietarios.dni, `%${searchTerm}%`),
          like(propietarios.ruc, `%${searchTerm}%`),
          like(propietarios.telefono, `%${searchTerm}%`),
          like(propietarios.email, `%${searchTerm}%`),
        ),
      );
    }

    if (filters?.tipoDocumento) {
      conditions.push(eq(sql`${propietarios.tipoDocumento}::text`, filters.tipoDocumento));
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(propietarios.creadoEn, new Date(filters.fechaInicio)));
      conditions.push(lte(propietarios.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    } else if (filters?.fechaInicio) {
      conditions.push(gte(propietarios.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(propietarios.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    }

    conditions.push(isNull(propietarios.eliminadoEn));
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database.select({ total: count() }).from(propietarios).where(whereClause);

    const data = await database.select().from(propietarios).where(whereClause).orderBy(desc(propietarios.creadoEn)).limit(limit).offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(propietarios)
      .where(and(eq(propietarios.id, id), isNull(propietarios.eliminadoEn)));
    return result[0];
  }

  async create(data: PropietarioDTO) {
    const result = await database.insert(propietarios).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<PropietarioDTO>) {
    const result = await database
      .update(propietarios)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(propietarios.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.update(propietarios).set({ eliminadoEn: new Date() }).where(eq(propietarios.id, id)).returning();
    return result[0];
  }
}

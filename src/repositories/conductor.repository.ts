import { Injectable } from '@nestjs/common';
import { eq, or, like, and, gte, lte, count, sql, ilike, desc, isNull } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { conductores, ConductorDTO } from '@db/tables/conductor.model';

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
  claseLicencia?: string;
  categoriaLicencia?: string;
}

@Injectable()
export class ConductorRepository {
  async findAll() {
    return await database.select().from(conductores);
  }

  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.search) {
      const searchTerm = filters.search.trim();
      conditions.push(
        or(
          ilike(conductores.nombreCompleto, `%${searchTerm}%`),
          like(conductores.dni, `%${searchTerm}%`),
          like(conductores.numeroLicencia, `%${searchTerm}%`),
          ilike(conductores.email, `%${searchTerm}%`),
          like(conductores.celular, `%${searchTerm}%`),
        ),
      );
    }

    if (filters?.claseLicencia) {
      conditions.push(eq(sql`${conductores.claseLicencia}::text`, filters.claseLicencia));
    }

    if (filters?.categoriaLicencia) {
      conditions.push(eq(sql`${conductores.categoriaLicencia}::text`, filters.categoriaLicencia));
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(conductores.creadoEn, new Date(filters.fechaInicio)));
      conditions.push(lte(conductores.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    } else if (filters?.fechaInicio) {
      conditions.push(gte(conductores.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(conductores.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    }

    // Excluir eliminados
    conditions.push(isNull(conductores.eliminadoEn));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database.select({ total: count() }).from(conductores).where(whereClause);

    const data = await database.select().from(conductores).where(whereClause).orderBy(desc(conductores.creadoEn)).limit(limit).offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(conductores)
      .where(and(eq(conductores.id, id), isNull(conductores.eliminadoEn)));
    return result[0];
  }

  async create(data: ConductorDTO) {
    const result = await database.insert(conductores).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<ConductorDTO>) {
    const result = await database
      .update(conductores)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(conductores.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.update(conductores).set({ eliminadoEn: new Date() }).where(eq(conductores.id, id)).returning();
    return result[0];
  }
}

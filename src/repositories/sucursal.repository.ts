import { Injectable } from '@nestjs/common';
import { eq, or, ilike, and, gte, lte, count, desc, isNull } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { sucursales, SucursalDTO } from '@db/tables/sucursal.table';

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

@Injectable()
export class SucursalRepository {
  async findAll() {
    return await database.select().from(sucursales).where(isNull(sucursales.eliminadoEn));
  }

  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;
    const conditions = [isNull(sucursales.eliminadoEn)];

    if (filters?.search) {
      const searchTerm = filters.search.trim();
      conditions.push(or(ilike(sucursales.nombre, `%${searchTerm}%`), ilike(sucursales.direccion, `%${searchTerm}%`)));
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(sucursales.creadoEn, new Date(filters.fechaInicio)));
      conditions.push(lte(sucursales.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    } else if (filters?.fechaInicio) {
      conditions.push(gte(sucursales.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(sucursales.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    }

    const whereClause = and(...conditions);

    const [{ total }] = await database.select({ total: count() }).from(sucursales).where(whereClause);

    const data = await database.select().from(sucursales).where(whereClause).orderBy(desc(sucursales.creadoEn)).limit(limit).offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(sucursales)
      .where(and(eq(sucursales.id, id), isNull(sucursales.eliminadoEn)));
    return result[0];
  }

  async create(data: SucursalDTO) {
    const result = await database.insert(sucursales).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<SucursalDTO>) {
    const result = await database
      .update(sucursales)
      .set({ ...data, actualizadoEn: new Date() })
      .where(and(eq(sucursales.id, id), isNull(sucursales.eliminadoEn)))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.update(sucursales).set({ eliminadoEn: new Date() }).where(eq(sucursales.id, id)).returning();
    return result[0];
  }
}

import { Injectable } from '@nestjs/common';
import { eq, and, isNull, ilike, or, desc, count } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { entidades, EntidadDTO } from '@db/tables/entidad.table';

interface PaginationFilters {
  search?: string;
  clienteId?: number;
}

@Injectable()
export class EntidadRepository {
  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;
    const conditions = [isNull(entidades.eliminadoEn)];

    if (filters?.clienteId) {
      conditions.push(eq(entidades.clienteId, filters.clienteId));
    }

    if (filters?.search) {
      const searchTerm = filters.search.trim();
      conditions.push(or(ilike(entidades.nombreServicio, `%${searchTerm}%`)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database.select({ total: count() }).from(entidades).where(whereClause);

    const data = await database.select().from(entidades).where(whereClause).orderBy(desc(entidades.creadoEn)).limit(limit).offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(entidades)
      .where(and(eq(entidades.id, id), isNull(entidades.eliminadoEn)));

    return result[0] || null;
  }

  async findByClienteId(clienteId: number) {
    return await database
      .select()
      .from(entidades)
      .where(and(eq(entidades.clienteId, clienteId), isNull(entidades.eliminadoEn)));
  }

  async create(data: EntidadDTO) {
    const [newItem] = await database.insert(entidades).values(data).returning();
    return newItem;
  }

  async update(id: number, data: Partial<EntidadDTO>) {
    const [updatedItem] = await database
      .update(entidades)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(entidades.id, id))
      .returning();
    return updatedItem;
  }

  async delete(id: number) {
    const [deletedItem] = await database.update(entidades).set({ eliminadoEn: new Date() }).where(eq(entidades.id, id)).returning();
    return deletedItem;
  }
}

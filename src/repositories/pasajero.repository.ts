import { Injectable } from '@nestjs/common';
import { eq, and, isNull, ilike, or, desc, count } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { pasajeros, PasajeroDTO } from '@db/tables/pasajero.table';

interface PaginationFilters {
  search?: string;
  clienteId?: number;
}

@Injectable()
export class PasajeroRepository {
  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;
    const conditions = [isNull(pasajeros.eliminadoEn)];

    if (filters?.clienteId) {
      conditions.push(eq(pasajeros.clienteId, filters.clienteId));
    }

    if (filters?.search) {
      const searchTerm = filters.search.trim();
      conditions.push(
        or(ilike(pasajeros.dni, `%${searchTerm}%`), ilike(pasajeros.nombres, `%${searchTerm}%`), ilike(pasajeros.apellidos, `%${searchTerm}%`)),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database.select({ total: count() }).from(pasajeros).where(whereClause);

    const data = await database.select().from(pasajeros).where(whereClause).orderBy(desc(pasajeros.creadoEn)).limit(limit).offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(pasajeros)
      .where(and(eq(pasajeros.id, id), isNull(pasajeros.eliminadoEn)));

    return result[0] || null;
  }

  async findByClienteId(clienteId: number) {
    return await database
      .select()
      .from(pasajeros)
      .where(and(eq(pasajeros.clienteId, clienteId), isNull(pasajeros.eliminadoEn)));
  }

  async create(data: PasajeroDTO) {
    const [newItem] = await database.insert(pasajeros).values(data).returning();
    return newItem;
  }

  async update(id: number, data: Partial<PasajeroDTO>) {
    const [updatedItem] = await database
      .update(pasajeros)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(pasajeros.id, id))
      .returning();
    return updatedItem;
  }

  async delete(id: number) {
    const [deletedItem] = await database.update(pasajeros).set({ eliminadoEn: new Date() }).where(eq(pasajeros.id, id)).returning();
    return deletedItem;
  }
}

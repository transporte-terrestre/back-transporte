import { Injectable } from '@nestjs/common';
import { eq, and, isNull, ilike, or, desc, count } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { encargados, EncargadoDTO } from '@db/tables/encargado.table';

interface PaginationFilters {
  search?: string;
  clienteId?: number;
}

@Injectable()
export class EncargadoRepository {
  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;
    const conditions = [isNull(encargados.eliminadoEn)];

    if (filters?.clienteId) {
      conditions.push(eq(encargados.clienteId, filters.clienteId));
    }

    if (filters?.search) {
      const searchTerm = filters.search.trim();
      conditions.push(
        or(ilike(encargados.dni, `%${searchTerm}%`), ilike(encargados.nombres, `%${searchTerm}%`), ilike(encargados.apellidos, `%${searchTerm}%`)),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database.select({ total: count() }).from(encargados).where(whereClause);

    const data = await database.select().from(encargados).where(whereClause).orderBy(desc(encargados.creadoEn)).limit(limit).offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(encargados)
      .where(and(eq(encargados.id, id), isNull(encargados.eliminadoEn)));

    return result[0] || null;
  }

  async findOneByDni(dni: string) {
    const result = await database
      .select()
      .from(encargados)
      .where(and(eq(encargados.dni, dni), isNull(encargados.eliminadoEn)));

    return result[0] || null;
  }

  async findByClienteId(clienteId: number) {
    return await database
      .select()
      .from(encargados)
      .where(and(eq(encargados.clienteId, clienteId), isNull(encargados.eliminadoEn)));
  }

  async create(data: EncargadoDTO) {
    const [newItem] = await database.insert(encargados).values(data).returning();
    return newItem;
  }

  async update(id: number, data: Partial<EncargadoDTO>) {
    const [updatedItem] = await database
      .update(encargados)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(encargados.id, id))
      .returning();
    return updatedItem;
  }

  async delete(id: number) {
    const [deletedItem] = await database.update(encargados).set({ eliminadoEn: new Date() }).where(eq(encargados.id, id)).returning();
    return deletedItem;
  }
}

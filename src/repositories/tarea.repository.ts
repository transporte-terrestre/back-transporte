import { Injectable } from "@nestjs/common";
import {
  eq,
  ilike,
  or,
  count,
  getTableColumns,
  isNull,
  and,
  like,
} from "drizzle-orm";
import { database } from "@db/connection.db";
import { tareas, TareaDTO } from "@model/tables/tarea.model";

interface PaginationFilters {
  search?: string;
}

@Injectable()
export class TareaRepository {
  async findAll() {
    return await database
      .select()
      .from(tareas)
      .where(isNull(tareas.eliminadoEn));
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: PaginationFilters
  ) {
    const offset = (page - 1) * limit;
    const conditions = [isNull(tareas.eliminadoEn)];

    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      conditions.push(
        or(
          like(tareas.codigo, searchTerm),
          ilike(tareas.descripcion, searchTerm)
        )!
      );
    }

    const whereClause = and(...conditions);

    const [{ total }] = await database
      .select({ total: count() })
      .from(tareas)
      .where(whereClause);

    const data = await database
      .select(getTableColumns(tareas))
      .from(tareas)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(tareas)
      .where(and(eq(tareas.id, id), isNull(tareas.eliminadoEn)));

    return result[0] || null;
  }

  async create(data: TareaDTO) {
    const result = await database.insert(tareas).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<TareaDTO>) {
    const result = await database
      .update(tareas)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(tareas.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    // Eliminación lógica
    const result = await database
      .update(tareas)
      .set({ eliminadoEn: new Date() })
      .where(eq(tareas.id, id))
      .returning();
    return result[0];
  }
}

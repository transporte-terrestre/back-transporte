import { Injectable } from "@nestjs/common";
import { eq, or, like, and, gte, lte, count, sql } from "drizzle-orm";
import { database } from "@db/connection.db";
import { mantenimientos, MantenimientoDTO } from "@model/tables/mantenimiento.model";

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

@Injectable()
export class MantenimientoRepository {
  async findAll() {
    return await database.select().from(mantenimientos);
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: PaginationFilters,
  ) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      conditions.push(
        or(
          like(mantenimientos.tipo, searchTerm),
          like(mantenimientos.proveedor, searchTerm),
          like(mantenimientos.descripcion, searchTerm),
        ),
      );
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(
        and(
          gte(sql`${mantenimientos.fecha}::timestamp`, new Date(filters.fechaInicio)),
          lte(sql`${mantenimientos.fecha}::timestamp`, new Date(filters.fechaFin + "T23:59:59")),
        ),
      );
    } else if (filters?.fechaInicio) {
      conditions.push(gte(sql`${mantenimientos.fecha}::timestamp`, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(sql`${mantenimientos.fecha}::timestamp`, new Date(filters.fechaFin + "T23:59:59")));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database
      .select({ total: count() })
      .from(mantenimientos)
      .where(whereClause);

    const data = await database
      .select()
      .from(mantenimientos)
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
      .from(mantenimientos)
      .where(eq(mantenimientos.id, id));
    return result[0];
  }

  async create(data: MantenimientoDTO) {
    const result = await database.insert(mantenimientos).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<MantenimientoDTO>) {
    const result = await database
      .update(mantenimientos)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(mantenimientos.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database
      .delete(mantenimientos)
      .where(eq(mantenimientos.id, id))
      .returning();
    return result[0];
  }
}

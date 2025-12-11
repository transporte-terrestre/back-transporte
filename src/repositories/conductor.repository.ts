import { Injectable } from "@nestjs/common";
import { eq, or, like, and, gte, lte, count } from "drizzle-orm";
import { database } from "@db/connection.db";
import { conductores, ConductorDTO } from "@model/tables/conductor.model";

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

@Injectable()
export class ConductorRepository {
  async findAll() {
    return await database.select().from(conductores);
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
          like(conductores.nombre, searchTerm),
          like(conductores.dni, searchTerm),
          like(conductores.numeroLicencia, searchTerm),
        ),
      );
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(
        and(
          gte(conductores.creadoEn, new Date(filters.fechaInicio)),
          lte(conductores.creadoEn, new Date(filters.fechaFin + "T23:59:59")),
        ),
      );
    } else if (filters?.fechaInicio) {
      conditions.push(gte(conductores.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(conductores.creadoEn, new Date(filters.fechaFin + "T23:59:59")));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database
      .select({ total: count() })
      .from(conductores)
      .where(whereClause);

    const data = await database
      .select()
      .from(conductores)
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
      .from(conductores)
      .where(eq(conductores.id, id));
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
    const result = await database
      .delete(conductores)
      .where(eq(conductores.id, id))
      .returning();
    return result[0];
  }
}

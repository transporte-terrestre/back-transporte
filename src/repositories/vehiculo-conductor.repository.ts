import { Injectable } from "@nestjs/common";
import { eq, and, gte, lte, count } from "drizzle-orm";
import { database } from "@db/connection.db";
import {
  vehiculosConductores,
  VehiculoConductorDTO,
} from "@model/tables/vehiculo-conductor.model";

interface PaginationFilters {
  fechaInicio?: string;
  fechaFin?: string;
}

@Injectable()
export class VehiculoConductorRepository {
  async findAll() {
    return await database.select().from(vehiculosConductores);
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: PaginationFilters,
  ) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(
        and(
          gte(vehiculosConductores.asignadoEn, new Date(filters.fechaInicio)),
          lte(vehiculosConductores.asignadoEn, new Date(filters.fechaFin + "T23:59:59")),
        ),
      );
    } else if (filters?.fechaInicio) {
      conditions.push(gte(vehiculosConductores.asignadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(vehiculosConductores.asignadoEn, new Date(filters.fechaFin + "T23:59:59")));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database
      .select({ total: count() })
      .from(vehiculosConductores)
      .where(whereClause);

    const data = await database
      .select()
      .from(vehiculosConductores)
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
      .from(vehiculosConductores)
      .where(eq(vehiculosConductores.id, id));
    return result[0];
  }

  async create(data: VehiculoConductorDTO) {
    const result = await database
      .insert(vehiculosConductores)
      .values(data)
      .returning();
    return result[0];
  }

  async update(id: number, data: Partial<VehiculoConductorDTO>) {
    // Note: vehiculosConductores might not have actualizadoEn in the original schema but added it for consistency in model
    const result = await database
      .update(vehiculosConductores)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(vehiculosConductores.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database
      .delete(vehiculosConductores)
      .where(eq(vehiculosConductores.id, id))
      .returning();
    return result[0];
  }
}

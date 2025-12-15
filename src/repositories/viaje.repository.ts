import { Injectable } from "@nestjs/common";
import { eq, like, and, gte, lte, count, sql, or } from "drizzle-orm";
import { database } from "@db/connection.db";
import { viajes, ViajeDTO } from "@model/tables/viaje.model";

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
  modalidadServicio?: string;
  tipoRuta?: string;
  estado?: string;
}

@Injectable()
export class ViajeRepository {
  async findAll() {
    return await database.select().from(viajes);
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: PaginationFilters
  ) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      conditions.push(
        or(
          like(viajes.rutaOcasional, searchTerm),
          like(sql`${viajes.modalidadServicio}::text`, searchTerm)
        )
      );
    }

    if (filters?.modalidadServicio) {
      conditions.push(
        eq(sql`${viajes.modalidadServicio}::text`, filters.modalidadServicio)
      );
    }

    if (filters?.tipoRuta) {
      conditions.push(eq(sql`${viajes.tipoRuta}::text`, filters.tipoRuta));
    }

    if (filters?.estado) {
      conditions.push(eq(sql`${viajes.estado}::text`, filters.estado));
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(viajes.fechaSalida, new Date(filters.fechaInicio)));
      conditions.push(
        lte(viajes.fechaSalida, new Date(filters.fechaFin + "T23:59:59"))
      );
    } else if (filters?.fechaInicio) {
      conditions.push(gte(viajes.fechaSalida, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(
        lte(viajes.fechaSalida, new Date(filters.fechaFin + "T23:59:59"))
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database
      .select({ total: count() })
      .from(viajes)
      .where(whereClause);

    const data = await database
      .select()
      .from(viajes)
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
      .from(viajes)
      .where(eq(viajes.id, id));
    return result[0];
  }

  async create(data: ViajeDTO) {
    const result = await database.insert(viajes).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<ViajeDTO>) {
    const result = await database
      .update(viajes)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(viajes.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database
      .delete(viajes)
      .where(eq(viajes.id, id))
      .returning();
    return result[0];
  }
}

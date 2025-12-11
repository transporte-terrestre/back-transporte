import { Injectable } from "@nestjs/common";
import { database } from "@db/connection.db";
import { clientes, Cliente, ClienteDTO } from "@model/tables/cliente.model";
import { eq, sql, count, or, like, and, gte, lte } from "drizzle-orm";

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

@Injectable()
export class ClienteRepository {
  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: PaginationFilters,
  ) {
    const offset = (page - 1) * limit;

    // Construir condiciones de filtro
    const conditions = [];

    // Filtro de búsqueda flexible
    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      conditions.push(
        or(
          like(clientes.nombre, searchTerm),
          like(clientes.apellido, searchTerm),
          like(clientes.dni, searchTerm),
          like(clientes.telefono, searchTerm),
          like(clientes.email, searchTerm),
        ),
      );
    }

    // Filtro por rango de fechas
    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(
        and(
          gte(clientes.creadoEn, new Date(filters.fechaInicio)),
          lte(clientes.creadoEn, new Date(filters.fechaFin + "T23:59:59")),
        ),
      );
    } else if (filters?.fechaInicio) {
      conditions.push(gte(clientes.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(clientes.creadoEn, new Date(filters.fechaFin + "T23:59:59")));
    }

    // Combinar todas las condiciones
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Obtener el total de registros con filtros
    const [{ total }] = await database
      .select({ total: count() })
      .from(clientes)
      .where(whereClause);

    // Obtener los datos paginados con filtros
    const data = await database
      .select()
      .from(clientes)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database.select().from(clientes).where(eq(clientes.id, id));
    return result[0];
  }

  async findByDni(dni: string) {
    const result = await database
      .select()
      .from(clientes)
      .where(eq(clientes.dni, dni));
    return result[0];
  }

  async findByEmail(email: string) {
    const result = await database
      .select()
      .from(clientes)
      .where(eq(clientes.email, email));
    return result[0];
  }

  async create(data: ClienteDTO) {
    const result = await database.insert(clientes).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<ClienteDTO>) {
    const result = await database
      .update(clientes)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(clientes.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database
      .delete(clientes)
      .where(eq(clientes.id, id))
      .returning();
    return result[0];
  }
}

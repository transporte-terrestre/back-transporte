import { Injectable } from '@nestjs/common';
import { database } from '@db/connection.db';
import { clientes, Cliente, ClienteDTO } from '@db/tables/cliente.model';
import { eq, sql, count, or, like, and, gte, lte, ilike, desc, isNull } from 'drizzle-orm';

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
  tipoDocumento?: string;
}

@Injectable()
export class ClienteRepository {
  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;

    // Construir condiciones de filtro
    const conditions = [];

    // Filtro de búsqueda flexible
    if (filters?.search) {
      const searchTerm = filters.search.trim();
      conditions.push(
        or(
          ilike(clientes.nombreCompleto, `%${searchTerm}%`),
          like(clientes.dni, `%${searchTerm}%`),
          like(clientes.ruc, `%${searchTerm}%`),
          like(clientes.telefono, `%${searchTerm}%`),
          like(clientes.email, `%${searchTerm}%`),
        ),
      );
    }

    if (filters?.tipoDocumento) {
      conditions.push(eq(sql`${clientes.tipoDocumento}::text`, filters.tipoDocumento));
    }

    // Filtro por rango de fechas
    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(clientes.creadoEn, new Date(filters.fechaInicio)));
      conditions.push(lte(clientes.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    } else if (filters?.fechaInicio) {
      conditions.push(gte(clientes.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(clientes.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    }

    // Combinar todas las condiciones y excluir eliminados
    conditions.push(isNull(clientes.eliminadoEn));
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Obtener el total de registros con filtros
    const [{ total }] = await database.select({ total: count() }).from(clientes).where(whereClause);

    // Obtener los datos paginados con filtros
    const data = await database.select().from(clientes).where(whereClause).orderBy(desc(clientes.creadoEn)).limit(limit).offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(clientes)
      .where(and(eq(clientes.id, id), isNull(clientes.eliminadoEn)));
    return result[0];
  }

  async findByDni(dni: string) {
    const result = await database
      .select()
      .from(clientes)
      .where(and(eq(clientes.dni, dni), isNull(clientes.eliminadoEn)));
    return result[0];
  }

  async findByRuc(ruc: string) {
    const result = await database
      .select()
      .from(clientes)
      .where(and(eq(clientes.ruc, ruc), isNull(clientes.eliminadoEn)));
    return result[0];
  }

  async findByEmail(email: string) {
    const result = await database
      .select()
      .from(clientes)
      .where(and(eq(clientes.email, email), isNull(clientes.eliminadoEn)));
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
    const result = await database.update(clientes).set({ eliminadoEn: new Date() }).where(eq(clientes.id, id)).returning();
    return result[0];
  }
}

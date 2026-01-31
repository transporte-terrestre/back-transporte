import { Injectable } from '@nestjs/common';
import { database } from '@db/connection.db';
import { proveedores, Proveedor, ProveedorDTO } from '@db/tables/proveedor.model';
import { eq, sql, count, or, like, and, gte, lte, ilike, desc, isNull } from 'drizzle-orm';

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
  tipoDocumento?: string;
}

@Injectable()
export class ProveedorRepository {
  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.search) {
      const searchTerm = filters.search.trim();
      conditions.push(
        or(
          ilike(proveedores.nombreCompleto, `%${searchTerm}%`),
          like(proveedores.dni, `%${searchTerm}%`),
          like(proveedores.ruc, `%${searchTerm}%`),
          like(proveedores.telefono, `%${searchTerm}%`),
          like(proveedores.email, `%${searchTerm}%`),
        ),
      );
    }

    if (filters?.tipoDocumento) {
      conditions.push(eq(sql`${proveedores.tipoDocumento}::text`, filters.tipoDocumento));
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(proveedores.creadoEn, new Date(filters.fechaInicio)));
      conditions.push(lte(proveedores.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    } else if (filters?.fechaInicio) {
      conditions.push(gte(proveedores.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(proveedores.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    }

    conditions.push(isNull(proveedores.eliminadoEn));
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database.select({ total: count() }).from(proveedores).where(whereClause);

    const data = await database.select().from(proveedores).where(whereClause).orderBy(desc(proveedores.creadoEn)).limit(limit).offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(proveedores)
      .where(and(eq(proveedores.id, id), isNull(proveedores.eliminadoEn)));
    return result[0];
  }

  async create(data: ProveedorDTO) {
    const result = await database.insert(proveedores).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<ProveedorDTO>) {
    const result = await database
      .update(proveedores)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(proveedores.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.update(proveedores).set({ eliminadoEn: new Date() }).where(eq(proveedores.id, id)).returning();
    return result[0];
  }
}

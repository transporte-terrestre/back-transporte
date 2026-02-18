import { Injectable } from '@nestjs/common';
import { eq, and, gte, lte, count } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { vehiculoDocumentos, VehiculoDocumentoDTO } from '@db/tables/vehiculo-documento.table';

interface PaginationFilters {
  vehiculoId?: number;
  tipo?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

@Injectable()
export class VehiculoDocumentoRepository {
  async findAll() {
    return await database.select().from(vehiculoDocumentos);
  }

  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.vehiculoId) {
      conditions.push(eq(vehiculoDocumentos.vehiculoId, filters.vehiculoId));
    }

    if (filters?.tipo) {
      conditions.push(eq(vehiculoDocumentos.tipo, filters.tipo as any));
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(vehiculoDocumentos.creadoEn, new Date(filters.fechaInicio)));
      conditions.push(lte(vehiculoDocumentos.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    } else if (filters?.fechaInicio) {
      conditions.push(gte(vehiculoDocumentos.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(vehiculoDocumentos.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database.select({ total: count() }).from(vehiculoDocumentos).where(whereClause);

    const data = await database.select().from(vehiculoDocumentos).where(whereClause).limit(limit).offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database.select().from(vehiculoDocumentos).where(eq(vehiculoDocumentos.id, id));
    return result[0];
  }

  async findByVehiculoId(vehiculoId: number) {
    return await database.select().from(vehiculoDocumentos).where(eq(vehiculoDocumentos.vehiculoId, vehiculoId));
  }

  async create(data: VehiculoDocumentoDTO) {
    const result = await database.insert(vehiculoDocumentos).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<VehiculoDocumentoDTO>) {
    const result = await database
      .update(vehiculoDocumentos)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(vehiculoDocumentos.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.delete(vehiculoDocumentos).where(eq(vehiculoDocumentos.id, id)).returning();
    return result[0];
  }
}

import { Injectable } from '@nestjs/common';
import { eq, and, gte, lte, count } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { propietarioDocumentos, PropietarioDocumentoDTO } from '@model/tables/propietario-documento.model';

interface PaginationFilters {
  propietarioId?: number;
  tipo?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

@Injectable()
export class PropietarioDocumentoRepository {
  async findAll() {
    return await database.select().from(propietarioDocumentos);
  }

  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.propietarioId) {
      conditions.push(eq(propietarioDocumentos.propietarioId, filters.propietarioId));
    }

    if (filters?.tipo) {
      conditions.push(eq(propietarioDocumentos.tipo, filters.tipo as any));
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(propietarioDocumentos.creadoEn, new Date(filters.fechaInicio)));
      conditions.push(lte(propietarioDocumentos.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    } else if (filters?.fechaInicio) {
      conditions.push(gte(propietarioDocumentos.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(propietarioDocumentos.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database.select({ total: count() }).from(propietarioDocumentos).where(whereClause);

    const data = await database.select().from(propietarioDocumentos).where(whereClause).limit(limit).offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database.select().from(propietarioDocumentos).where(eq(propietarioDocumentos.id, id));
    return result[0];
  }

  async findByPropietarioId(propietarioId: number) {
    return await database.select().from(propietarioDocumentos).where(eq(propietarioDocumentos.propietarioId, propietarioId));
  }

  async create(data: PropietarioDocumentoDTO) {
    const result = await database.insert(propietarioDocumentos).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<PropietarioDocumentoDTO>) {
    const result = await database
      .update(propietarioDocumentos)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(propietarioDocumentos.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.delete(propietarioDocumentos).where(eq(propietarioDocumentos.id, id)).returning();
    return result[0];
  }
}

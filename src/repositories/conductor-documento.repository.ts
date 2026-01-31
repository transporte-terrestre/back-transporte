import { Injectable } from '@nestjs/common';
import { eq, and, gte, lte, count } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { conductorDocumentos, ConductorDocumentoDTO } from '@db/tables/conductor-documento.model';

interface PaginationFilters {
  conductorId?: number;
  tipo?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

@Injectable()
export class ConductorDocumentoRepository {
  async findAll() {
    return await database.select().from(conductorDocumentos);
  }

  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.conductorId) {
      conditions.push(eq(conductorDocumentos.conductorId, filters.conductorId));
    }

    if (filters?.tipo) {
      conditions.push(eq(conductorDocumentos.tipo, filters.tipo as any));
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(conductorDocumentos.creadoEn, new Date(filters.fechaInicio)));
      conditions.push(lte(conductorDocumentos.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    } else if (filters?.fechaInicio) {
      conditions.push(gte(conductorDocumentos.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(conductorDocumentos.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database.select({ total: count() }).from(conductorDocumentos).where(whereClause);

    const data = await database.select().from(conductorDocumentos).where(whereClause).limit(limit).offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database.select().from(conductorDocumentos).where(eq(conductorDocumentos.id, id));
    return result[0];
  }

  async findByConductorId(conductorId: number) {
    return await database.select().from(conductorDocumentos).where(eq(conductorDocumentos.conductorId, conductorId));
  }

  async create(data: ConductorDocumentoDTO) {
    const result = await database.insert(conductorDocumentos).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<ConductorDocumentoDTO>) {
    const result = await database
      .update(conductorDocumentos)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(conductorDocumentos.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.delete(conductorDocumentos).where(eq(conductorDocumentos.id, id)).returning();
    return result[0];
  }
}

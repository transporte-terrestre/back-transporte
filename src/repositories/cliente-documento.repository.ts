import { Injectable } from '@nestjs/common';
import { eq, and, gte, lte, count } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { clienteDocumentos, ClienteDocumentoDTO } from '@db/tables/cliente-documento.model';

interface PaginationFilters {
  clienteId?: number;
  tipo?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

@Injectable()
export class ClienteDocumentoRepository {
  async findAll() {
    return await database.select().from(clienteDocumentos);
  }

  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.clienteId) {
      conditions.push(eq(clienteDocumentos.clienteId, filters.clienteId));
    }

    if (filters?.tipo) {
      conditions.push(eq(clienteDocumentos.tipo, filters.tipo as any));
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(clienteDocumentos.creadoEn, new Date(filters.fechaInicio)));
      conditions.push(lte(clienteDocumentos.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    } else if (filters?.fechaInicio) {
      conditions.push(gte(clienteDocumentos.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(clienteDocumentos.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database.select({ total: count() }).from(clienteDocumentos).where(whereClause);

    const data = await database.select().from(clienteDocumentos).where(whereClause).limit(limit).offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database.select().from(clienteDocumentos).where(eq(clienteDocumentos.id, id));
    return result[0];
  }

  async findByClienteId(clienteId: number) {
    return await database.select().from(clienteDocumentos).where(eq(clienteDocumentos.clienteId, clienteId));
  }

  async create(data: ClienteDocumentoDTO) {
    const result = await database.insert(clienteDocumentos).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<ClienteDocumentoDTO>) {
    const result = await database
      .update(clienteDocumentos)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(clienteDocumentos.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.delete(clienteDocumentos).where(eq(clienteDocumentos.id, id)).returning();
    return result[0];
  }
}

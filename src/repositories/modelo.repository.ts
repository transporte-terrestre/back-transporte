import { Injectable } from "@nestjs/common";
import { database } from "@db/connection.db";
import { modelos, ModeloDTO } from "@model/tables/modelo.model";
import { marcas } from "@model/tables/marca.model";
import {
  eq,
  count,
  and,
  gte,
  lte,
  ilike,
  desc,
  isNull,
  getTableColumns,
} from "drizzle-orm";

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
  marcaId?: number;
}

@Injectable()
export class ModeloRepository {
  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: PaginationFilters
  ) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.search) {
      const searchTerm = filters.search.trim();
      conditions.push(ilike(modelos.nombre, `%${searchTerm}%`));
    }

    if (filters?.marcaId) {
      conditions.push(eq(modelos.marcaId, filters.marcaId));
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(modelos.creadoEn, new Date(filters.fechaInicio)));
      conditions.push(
        lte(modelos.creadoEn, new Date(filters.fechaFin + "T23:59:59"))
      );
    } else if (filters?.fechaInicio) {
      conditions.push(gte(modelos.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(
        lte(modelos.creadoEn, new Date(filters.fechaFin + "T23:59:59"))
      );
    }

    conditions.push(isNull(modelos.eliminadoEn));
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database
      .select({ total: count() })
      .from(modelos)
      .where(whereClause);

    const data = await database
      .select({
        id: modelos.id,
        nombre: modelos.nombre,
        marcaId: modelos.marcaId,
        marcaNombre: marcas.nombre,
        creadoEn: modelos.creadoEn,
        actualizadoEn: modelos.actualizadoEn,
      })
      .from(modelos)
      .innerJoin(marcas, eq(modelos.marcaId, marcas.id))
      .where(whereClause)
      .orderBy(desc(modelos.creadoEn))
      .limit(limit)
      .offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database
      .select({
        ...getTableColumns(modelos),
        nombreMarca: marcas.nombre,
      })
      .from(modelos)
      .innerJoin(marcas, eq(modelos.marcaId, marcas.id))
      .where(and(eq(modelos.id, id), isNull(modelos.eliminadoEn)));
    return result[0];
  }

  async create(data: ModeloDTO) {
    const result = await database.insert(modelos).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<ModeloDTO>) {
    const result = await database
      .update(modelos)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(modelos.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database
      .update(modelos)
      .set({ eliminadoEn: new Date() })
      .where(eq(modelos.id, id))
      .returning();
    return result[0];
  }
}

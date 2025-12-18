import { Injectable } from "@nestjs/common";
import {
  eq,
  or,
  like,
  and,
  gte,
  lte,
  count,
  sql,
  isNull,
  getTableColumns,
} from "drizzle-orm";
import { database } from "@db/connection.db";
import {
  mantenimientos,
  MantenimientoDTO,
} from "@model/tables/mantenimiento.model";
import { vehiculos } from "@model/tables/vehiculo.model";
import { talleres } from "@model/tables/taller.model";
import { mantenimientoTareas } from "@model/tables/mantenimiento-tarea.model";
import { mantenimientoDocumentos } from "@model/tables/mantenimiento-documento.model";

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
  tipo?: string;
  estado?: string;
}

@Injectable()
export class MantenimientoRepository {
  async findAll() {
    return await database.select().from(mantenimientos);
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: PaginationFilters
  ) {
    const offset = (page - 1) * limit;
    const conditions = [];

    conditions.push(isNull(mantenimientos.eliminadoEn));

    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      conditions.push(
        or(
          like(mantenimientos.descripcion, searchTerm),
          like(mantenimientos.codigoOrden, searchTerm)
        )
      );
    }

    if (filters?.tipo) {
      conditions.push(eq(sql`${mantenimientos.tipo}::text`, filters.tipo));
    }

    if (filters?.estado) {
      conditions.push(eq(sql`${mantenimientos.estado}::text`, filters.estado));
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(
        gte(
          sql`${mantenimientos.fechaIngreso}::timestamp`,
          new Date(filters.fechaInicio)
        )
      );
      conditions.push(
        lte(
          sql`${mantenimientos.fechaIngreso}::timestamp`,
          new Date(filters.fechaFin + "T23:59:59")
        )
      );
    } else if (filters?.fechaInicio) {
      conditions.push(
        gte(
          sql`${mantenimientos.fechaIngreso}::timestamp`,
          new Date(filters.fechaInicio)
        )
      );
    } else if (filters?.fechaFin) {
      conditions.push(
        lte(
          sql`${mantenimientos.fechaIngreso}::timestamp`,
          new Date(filters.fechaFin + "T23:59:59")
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database
      .select({ total: count() })
      .from(mantenimientos)
      .where(whereClause);

    const data = await database
      .select({
        ...getTableColumns(mantenimientos),
        vehiculo: {
          ...getTableColumns(vehiculos),
        },
        taller: {
          ...getTableColumns(talleres),
        },
      })
      .from(mantenimientos)
      .leftJoin(vehiculos, eq(mantenimientos.vehiculoId, vehiculos.id))
      .leftJoin(talleres, eq(mantenimientos.tallerId, talleres.id))
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
      .select({
        ...getTableColumns(mantenimientos),
        vehiculo: {
          ...getTableColumns(vehiculos),
        },
        taller: {
          ...getTableColumns(talleres),
        },
      })
      .from(mantenimientos)
      .leftJoin(vehiculos, eq(mantenimientos.vehiculoId, vehiculos.id))
      .leftJoin(talleres, eq(mantenimientos.tallerId, talleres.id))
      .where(
        and(eq(mantenimientos.id, id), isNull(mantenimientos.eliminadoEn))
      );

    if (result.length === 0) return null;

    const maintenance = result[0];

    // Fetch related data sequentially (equivalent to ViajeRepository)
    const tareasList = await database
      .select()
      .from(mantenimientoTareas)
      .where(eq(mantenimientoTareas.mantenimientoId, id));

    const documentosList = await database
      .select()
      .from(mantenimientoDocumentos)
      .where(eq(mantenimientoDocumentos.mantenimientoId, id));

    return {
      ...maintenance,
      tareas: tareasList,
      documentos: documentosList,
    };
  }

  async create(data: MantenimientoDTO) {
    const result = await database
      .insert(mantenimientos)
      .values(data)
      .returning();
    return result[0];
  }

  async update(id: number, data: Partial<MantenimientoDTO>) {
    const result = await database
      .update(mantenimientos)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(mantenimientos.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database
      .update(mantenimientos)
      .set({ eliminadoEn: new Date() })
      .where(eq(mantenimientos.id, id))
      .returning();
    return result[0];
  }

  // ========== TAREAS ==========
  async createTarea(data: any) {
    const result = await database
      .insert(mantenimientoTareas)
      .values(data)
      .returning();
    return result[0];
  }

  async updateTarea(id: number, data: any) {
    const result = await database
      .update(mantenimientoTareas)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(mantenimientoTareas.id, id))
      .returning();
    return result[0];
  }

  async deleteTarea(id: number) {
    const result = await database
      .delete(mantenimientoTareas)
      .where(eq(mantenimientoTareas.id, id))
      .returning();
    return result[0];
  }

  // ========== DOCUMENTOS ==========
  async createDocumento(data: any) {
    const result = await database
      .insert(mantenimientoDocumentos)
      .values(data)
      .returning();
    return result[0];
  }

  async updateDocumento(id: number, data: any) {
    const result = await database
      .update(mantenimientoDocumentos)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(mantenimientoDocumentos.id, id))
      .returning();
    return result[0];
  }

  async deleteDocumento(id: number) {
    const result = await database
      .delete(mantenimientoDocumentos)
      .where(eq(mantenimientoDocumentos.id, id))
      .returning();
    return result[0];
  }
}

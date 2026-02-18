import { Injectable } from '@nestjs/common';
import { eq, or, like, and, gte, lte, count, sql, isNull, getTableColumns, desc } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { mantenimientos, MantenimientoDTO } from '@db/tables/mantenimiento.table';
import { vehiculos } from '@db/tables/vehiculo.table';
import { modelos } from '@db/tables/modelo.table';
import { marcas } from '@db/tables/marca.table';
import { talleres } from '@db/tables/taller.table';
import { mantenimientoTareas } from '@db/tables/mantenimiento-tarea.table';
import { mantenimientoDocumentos } from '@db/tables/mantenimiento-documento.table';
import { tareas } from '@db/tables/tarea.table';

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

  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;
    const conditions = [];

    conditions.push(isNull(mantenimientos.eliminadoEn));

    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      conditions.push(or(like(mantenimientos.descripcion, searchTerm), like(mantenimientos.codigoOrden, searchTerm)));
    }

    if (filters?.tipo) {
      conditions.push(eq(sql`${mantenimientos.tipo}::text`, filters.tipo));
    }

    if (filters?.estado) {
      conditions.push(eq(sql`${mantenimientos.estado}::text`, filters.estado));
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(sql`${mantenimientos.fechaIngreso}::timestamp`, new Date(filters.fechaInicio)));
      conditions.push(lte(sql`${mantenimientos.fechaIngreso}::timestamp`, new Date(filters.fechaFin + 'T23:59:59')));
    } else if (filters?.fechaInicio) {
      conditions.push(gte(sql`${mantenimientos.fechaIngreso}::timestamp`, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(sql`${mantenimientos.fechaIngreso}::timestamp`, new Date(filters.fechaFin + 'T23:59:59')));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database.select({ total: count() }).from(mantenimientos).where(whereClause);

    const data = await database
      .select({
        ...getTableColumns(mantenimientos),
        vehiculo: {
          ...getTableColumns(vehiculos),
          marca: marcas.nombre,
          modelo: modelos.nombre,
        },
        taller: {
          ...getTableColumns(talleres),
        },
      })
      .from(mantenimientos)
      .leftJoin(vehiculos, eq(mantenimientos.vehiculoId, vehiculos.id))
      .leftJoin(modelos, eq(vehiculos.modeloId, modelos.id))
      .leftJoin(marcas, eq(modelos.marcaId, marcas.id))
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
          marca: marcas.nombre,
          modelo: modelos.nombre,
        },
        taller: {
          ...getTableColumns(talleres),
        },
      })
      .from(mantenimientos)
      .leftJoin(vehiculos, eq(mantenimientos.vehiculoId, vehiculos.id))
      .leftJoin(modelos, eq(vehiculos.modeloId, modelos.id))
      .leftJoin(marcas, eq(modelos.marcaId, marcas.id))
      .leftJoin(talleres, eq(mantenimientos.tallerId, talleres.id))
      .where(and(eq(mantenimientos.id, id), isNull(mantenimientos.eliminadoEn)));

    if (result.length === 0) return null;

    const maintenance = result[0];

    const tareasList = await database
      .select({
        ...getTableColumns(mantenimientoTareas),
        tarea: {
          id: tareas.id,
          codigo: tareas.codigo,
          nombreTrabajo: tareas.nombreTrabajo,
          grupo: tareas.grupo,
        },
      })
      .from(mantenimientoTareas)
      .leftJoin(tareas, eq(mantenimientoTareas.tareaId, tareas.id))
      .where(eq(mantenimientoTareas.mantenimientoId, id));

    const documentosList = await database.select().from(mantenimientoDocumentos).where(eq(mantenimientoDocumentos.mantenimientoId, id));

    return {
      ...maintenance,
      tareas: tareasList,
      documentos: documentosList,
    };
  }

  async create(data: MantenimientoDTO) {
    const result = await database.insert(mantenimientos).values(data).returning();
    return result[0];
  }

  async getPlacaVehiculo(vehiculoId: number): Promise<string | null> {
    const [vehiculo] = await database.select({ placa: vehiculos.placa }).from(vehiculos).where(eq(vehiculos.id, vehiculoId));

    return vehiculo?.placa ?? null;
  }

  async countMantenimientosActivos(vehiculoId: number): Promise<number> {
    const [{ total }] = await database
      .select({ total: count() })
      .from(mantenimientos)
      .where(and(eq(mantenimientos.vehiculoId, vehiculoId), isNull(mantenimientos.eliminadoEn)));

    return Number(total);
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
    const result = await database.update(mantenimientos).set({ eliminadoEn: new Date() }).where(eq(mantenimientos.id, id)).returning();
    return result[0];
  }

  // ========== TAREAS ==========
  async createTarea(data: any) {
    const result = await database.insert(mantenimientoTareas).values(data).returning();
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
    const result = await database.delete(mantenimientoTareas).where(eq(mantenimientoTareas.id, id)).returning();
    return result[0];
  }

  // ========== DOCUMENTOS ==========
  async findDocumento(id: number) {
    const result = await database.select().from(mantenimientoDocumentos).where(eq(mantenimientoDocumentos.id, id));
    return result[0];
  }

  async createDocumento(data: any) {
    const result = await database.insert(mantenimientoDocumentos).values(data).returning();
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
    const result = await database.delete(mantenimientoDocumentos).where(eq(mantenimientoDocumentos.id, id)).returning();
    return result[0];
  }

  async getReporteEstadoVehiculos(page: number, limit: number, sort: 'proximos' | 'ultimos' = 'proximos') {
    const offset = (page - 1) * limit;

    const [{ total }] = await database.select({ total: count() }).from(vehiculos).where(isNull(vehiculos.eliminadoEn));

    // Consultar todos los datos necesarios para el reporte y ordenamiento
    // Se trae todo en memoria porque el ordenamiento depende de campos calculados complejos
    // y el conjunto de datos de vehículos (hundreds) es manejable en memoria.
    const rawData = await database
      .selectDistinctOn([vehiculos.id], {
        id: vehiculos.id,
        placa: vehiculos.placa,
        codigo_interno: vehiculos.codigoInterno,
        imagenes: vehiculos.imagenes,
        kilometraje_actual: vehiculos.kilometraje,
        ultimo_mantenimiento_fecha: mantenimientos.fechaIngreso,
        ultimo_mantenimiento_km: mantenimientos.kilometraje,
        prox_mantenimiento_km: mantenimientos.kilometrajeProximoMantenimiento,
      })
      .from(vehiculos)
      .leftJoin(mantenimientos, and(eq(vehiculos.id, mantenimientos.vehiculoId), isNull(mantenimientos.eliminadoEn)))
      .where(isNull(vehiculos.eliminadoEn))
      .orderBy(vehiculos.id, desc(mantenimientos.fechaIngreso));

    // Procesar para ordenamiento
    const processed = rawData.map((row) => {
      const actual = Number(row.kilometraje_actual || 0);
      const prox = row.prox_mantenimiento_km ? Number(row.prox_mantenimiento_km) : null;
      let restante: number | null = null;

      if (prox !== null) {
        restante = prox - actual;
      }

      return { ...row, restanteInternal: restante };
    });

    // Ordenar
    if (sort === 'proximos') {
      // Menor kilometraje restante primero (los más urgentes o vencidos)
      processed.sort((a, b) => {
        if (a.restanteInternal === null && b.restanteInternal === null) return 0;
        if (a.restanteInternal === null) return 1; // Nulos al final
        if (b.restanteInternal === null) return -1;
        return a.restanteInternal - b.restanteInternal;
      });
    } else {
      // Últimos mantenimientos: Fecha más reciente primero
      processed.sort((a, b) => {
        const dateA = a.ultimo_mantenimiento_fecha ? new Date(a.ultimo_mantenimiento_fecha).getTime() : 0;
        const dateB = b.ultimo_mantenimiento_fecha ? new Date(b.ultimo_mantenimiento_fecha).getTime() : 0;
        // DESC
        return dateB - dateA;
      });
    }

    // Paginar
    const data = processed.slice(offset, offset + limit);

    return {
      data,
      total: Number(total),
    };
  }
}

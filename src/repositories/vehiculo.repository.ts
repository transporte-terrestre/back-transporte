import { Injectable } from '@nestjs/common';
import { eq, or, like, and, gte, lte, count, sql, ilike, desc, isNull, getTableColumns } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { vehiculos, VehiculoDTO } from '@model/tables/vehiculo.model';
import { vehiculoDocumentos } from '@model/tables/vehiculo-documento.model';
import { modelos } from '@model/tables/modelo.model';
import { marcas } from '@model/tables/marca.model';
import { propietarios } from '@model/tables/propietario.model';

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
  estado?: string;
}

@Injectable()
export class VehiculoRepository {
  async findAll() {
    return await database
      .select({
        ...getTableColumns(vehiculos),
        marca: marcas.nombre,
        modelo: modelos.nombre,
        propietarioNombre: propietarios.nombreCompleto,
      })
      .from(vehiculos)
      .innerJoin(modelos, eq(vehiculos.modeloId, modelos.id))
      .innerJoin(marcas, eq(modelos.marcaId, marcas.id))
      .leftJoin(propietarios, eq(vehiculos.propietarioId, propietarios.id));
  }

  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.search) {
      const searchTerm = filters.search.trim();
      conditions.push(
        or(
          ilike(vehiculos.placa, `%${searchTerm}%`),
          ilike(marcas.nombre, `%${searchTerm}%`),
          ilike(modelos.nombre, `%${searchTerm}%`),
          like(vehiculos.codigoInterno, `%${searchTerm}%`),
          ilike(vehiculos.vin, `%${searchTerm}%`),
          ilike(vehiculos.numeroMotor, `%${searchTerm}%`),
          ilike(propietarios.nombreCompleto, `%${searchTerm}%`),
        ),
      );
    }

    if (filters?.estado) {
      conditions.push(eq(sql`${vehiculos.estado}::text`, filters.estado));
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(vehiculos.creadoEn, new Date(filters.fechaInicio)));
      conditions.push(lte(vehiculos.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    } else if (filters?.fechaInicio) {
      conditions.push(gte(vehiculos.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(vehiculos.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    }

    // Excluir eliminados
    conditions.push(isNull(vehiculos.eliminadoEn));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database
      .select({ total: count() })
      .from(vehiculos)
      .innerJoin(modelos, eq(vehiculos.modeloId, modelos.id))
      .innerJoin(marcas, eq(modelos.marcaId, marcas.id))
      .leftJoin(propietarios, eq(vehiculos.propietarioId, propietarios.id))
      .where(whereClause);

    const data = await database
      .select({
        ...getTableColumns(vehiculos),
        marca: marcas.nombre,
        modelo: modelos.nombre,
        propietarioNombre: propietarios.nombreCompleto,
      })
      .from(vehiculos)
      .innerJoin(modelos, eq(vehiculos.modeloId, modelos.id))
      .innerJoin(marcas, eq(modelos.marcaId, marcas.id))
      .leftJoin(propietarios, eq(vehiculos.propietarioId, propietarios.id))
      .where(whereClause)
      .orderBy(desc(vehiculos.creadoEn))
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
        ...getTableColumns(vehiculos),
        marca: marcas.nombre,
        modelo: modelos.nombre,
        propietarioNombre: propietarios.nombreCompleto,
      })
      .from(vehiculos)
      .innerJoin(modelos, eq(vehiculos.modeloId, modelos.id))
      .innerJoin(marcas, eq(modelos.marcaId, marcas.id))
      .leftJoin(propietarios, eq(vehiculos.propietarioId, propietarios.id))
      .where(and(eq(vehiculos.id, id), isNull(vehiculos.eliminadoEn)));
    return result[0];
  }

  async create(data: VehiculoDTO) {
    const result = await database.insert(vehiculos).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<VehiculoDTO>) {
    const result = await database
      .update(vehiculos)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(vehiculos.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.update(vehiculos).set({ eliminadoEn: new Date() }).where(eq(vehiculos.id, id)).returning();
    return result[0];
  }
}

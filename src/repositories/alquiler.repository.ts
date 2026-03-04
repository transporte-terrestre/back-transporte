import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, or, ilike, and, isNull, sql, SQL, desc } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { alquileres, AlquilerDTO } from '@db/tables/alquiler.table';
import { vehiculos } from '@db/tables/vehiculo.table';
import { modelos } from '@db/tables/modelo.table';
import { marcas } from '@db/tables/marca.table';
import { proveedores } from '@db/tables/proveedor.table';
import { vehiculoProveedores } from '@db/tables/vehiculo-proveedor.table';
import { AlquilerFiltersDto } from '@module/admin/alquileres/dto/alquiler/alquiler-list.dto';

@Injectable()
export class AlquilerRepository {
  async findAllPaginated(page: number, limit: number, filters: AlquilerFiltersDto) {
    const offset = (page - 1) * limit;

    const conditions: SQL<unknown>[] = [isNull(alquileres.eliminadoEn)];

    if (filters.search) {
      conditions.push(or(ilike(proveedores.nombreCompleto, `%${filters.search}%`), ilike(vehiculos.placa, `%${filters.search}%`)));
    }

    if (filters.estado) {
      conditions.push(eq(alquileres.estado, filters.estado));
    }

    const whereClause = and(...conditions);

    const baseQuery = database
      .select({
        id: alquileres.id,
        vehiculoId: alquileres.vehiculoId,

        fechaInicio: alquileres.fechaInicio,
        fechaFin: alquileres.fechaFin,
        monto: alquileres.monto,
        observaciones: alquileres.observaciones,
        estado: alquileres.estado,
        creadoEn: alquileres.creadoEn,
        actualizadoEn: alquileres.actualizadoEn,

        vehiculo: {
          id: vehiculos.id,
          placa: vehiculos.placa,
          marca: marcas.nombre,
          modelo: modelos.nombre,
        },
        proveedor: {
          id: proveedores.id,
          nombreCompleto: proveedores.nombreCompleto,
          dni: proveedores.dni,
          ruc: proveedores.ruc,
        },
      })
      .from(alquileres)
      .leftJoin(vehiculos, eq(alquileres.vehiculoId, vehiculos.id))
      .leftJoin(modelos, eq(vehiculos.modeloId, modelos.id))
      .leftJoin(marcas, eq(modelos.marcaId, marcas.id))
      .leftJoin(vehiculoProveedores, eq(vehiculos.id, vehiculoProveedores.vehiculoId))
      .leftJoin(proveedores, eq(vehiculoProveedores.proveedorId, proveedores.id))
      .where(whereClause);

    const data = await baseQuery.orderBy(desc(alquileres.creadoEn)).limit(limit).offset(offset);

    const [{ count }] = await database
      .select({ count: sql<number>`count(*)::int` })
      .from(alquileres)
      .leftJoin(vehiculos, eq(alquileres.vehiculoId, vehiculos.id))
      .leftJoin(vehiculoProveedores, eq(vehiculos.id, vehiculoProveedores.vehiculoId))
      .leftJoin(proveedores, eq(vehiculoProveedores.proveedorId, proveedores.id))
      .where(whereClause);

    return {
      data,
      total: count,
    };
  }

  async findOne(id: number) {
    const [record] = await database
      .select({
        id: alquileres.id,
        vehiculoId: alquileres.vehiculoId,

        fechaInicio: alquileres.fechaInicio,
        fechaFin: alquileres.fechaFin,
        monto: alquileres.monto,
        observaciones: alquileres.observaciones,
        estado: alquileres.estado,
        creadoEn: alquileres.creadoEn,
        actualizadoEn: alquileres.actualizadoEn,

        vehiculo: {
          id: vehiculos.id,
          placa: vehiculos.placa,
          marca: marcas.nombre,
          modelo: modelos.nombre,
        },
        proveedor: {
          id: proveedores.id,
          nombreCompleto: proveedores.nombreCompleto,
          dni: proveedores.dni,
          ruc: proveedores.ruc,
        },
      })
      .from(alquileres)
      .leftJoin(vehiculos, eq(alquileres.vehiculoId, vehiculos.id))
      .leftJoin(modelos, eq(vehiculos.modeloId, modelos.id))
      .leftJoin(marcas, eq(modelos.marcaId, marcas.id))
      .leftJoin(vehiculoProveedores, eq(vehiculos.id, vehiculoProveedores.vehiculoId))
      .leftJoin(proveedores, eq(vehiculoProveedores.proveedorId, proveedores.id))
      .where(and(eq(alquileres.id, id), isNull(alquileres.eliminadoEn)));

    return record;
  }

  async create(data: AlquilerDTO) {
    const [record] = await database.insert(alquileres).values(data).returning();
    return record;
  }

  async update(id: number, data: Partial<AlquilerDTO>) {
    const [record] = await database
      .update(alquileres)
      .set({ ...data, actualizadoEn: new Date() })
      .where(and(eq(alquileres.id, id), isNull(alquileres.eliminadoEn)))
      .returning();

    return record;
  }

  async delete(id: number) {
    const [record] = await database
      .update(alquileres)
      .set({
        eliminadoEn: new Date(),
        actualizadoEn: new Date(),
      })
      .where(and(eq(alquileres.id, id), isNull(alquileres.eliminadoEn)))
      .returning();

    return record;
  }

  async findActivosByVehiculo(vehiculoId: number) {
    return await database
      .select()
      .from(alquileres)
      .where(and(eq(alquileres.vehiculoId, vehiculoId), eq(alquileres.estado, 'activo'), isNull(alquileres.eliminadoEn)));
  }
}

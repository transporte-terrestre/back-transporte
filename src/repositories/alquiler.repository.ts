import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, or, ilike, and, isNull, sql, SQL, desc } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { alquileres, AlquilerDTO } from '@db/tables/alquiler.table';
import { vehiculos } from '@db/tables/vehiculo.table';
import { modelos } from '@db/tables/modelo.table';
import { marcas } from '@db/tables/marca.table';
import { clientes } from '@db/tables/cliente.table';
import { conductores } from '@db/tables/conductor.table';
import { proveedores } from '@db/tables/proveedor.table';
import { vehiculoProveedores } from '@db/tables/vehiculo-proveedor.table';
import { AlquilerFiltersDto } from '@module/admin/alquileres/dto/alquiler/alquiler-list.dto';

@Injectable()
export class AlquilerRepository {
  async findAllPaginated(page: number, limit: number, filters: AlquilerFiltersDto) {
    const offset = (page - 1) * limit;

    const conditions: SQL<unknown>[] = [isNull(alquileres.eliminadoEn)];

    if (filters.search) {
      conditions.push(
        or(
          ilike(proveedores.nombreCompleto, `%${filters.search}%`),
          ilike(clientes.nombreCompleto, `%${filters.search}%`),
          ilike(conductores.nombreCompleto, `%${filters.search}%`),
          ilike(vehiculos.placa, `%${filters.search}%`),
        ),
      );
    }

    if (filters.estado) {
      conditions.push(eq(alquileres.estado, filters.estado));
    }

    if (filters.clienteId) {
      conditions.push(eq(alquileres.clienteId, filters.clienteId));
    }

    if (filters.tipo) {
      conditions.push(eq(alquileres.tipo, filters.tipo as any));
    }

    const whereClause = and(...conditions);

    const baseQuery = database
      .select({
        id: alquileres.id,
        clienteId: alquileres.clienteId,
        vehiculoId: alquileres.vehiculoId,
        conductorId: alquileres.conductorId,

        tipo: alquileres.tipo,

        kilometrajeInicial: alquileres.kilometrajeInicial,
        kilometrajeFinal: alquileres.kilometrajeFinal,

        montoPorDia: alquileres.montoPorDia,
        montoTotalFinal: alquileres.montoTotalFinal,
        razon: alquileres.razon,

        fechaInicio: alquileres.fechaInicio,
        fechaFin: alquileres.fechaFin,
        monto: alquileres.monto,
        observaciones: alquileres.observaciones,
        estado: alquileres.estado,
        creadoEn: alquileres.creadoEn,
        actualizadoEn: alquileres.actualizadoEn,

        cliente: {
          id: clientes.id,
          nombreCompleto: sql<string>`CASE WHEN ${clientes.tipoDocumento} = 'RUC' THEN COALESCE(${clientes.razonSocial}, ${clientes.nombreCompleto}) ELSE ${clientes.nombreCompleto} END`,
        },

        vehiculo: {
          id: vehiculos.id,
          placa: vehiculos.placa,
          marca: marcas.nombre,
          modelo: modelos.nombre,
        },
        conductor: {
          id: conductores.id,
          nombreCompleto: conductores.nombreCompleto,
          dni: conductores.dni,
        },
        proveedor: {
          id: proveedores.id,
          nombreCompleto: proveedores.nombreCompleto,
          dni: proveedores.dni,
          ruc: proveedores.ruc,
        },
      })
      .from(alquileres)
      .leftJoin(clientes, eq(alquileres.clienteId, clientes.id))
      .leftJoin(vehiculos, eq(alquileres.vehiculoId, vehiculos.id))
      .leftJoin(conductores, eq(alquileres.conductorId, conductores.id))
      .leftJoin(modelos, eq(vehiculos.modeloId, modelos.id))
      .leftJoin(marcas, eq(modelos.marcaId, marcas.id))
      .leftJoin(vehiculoProveedores, eq(vehiculos.id, vehiculoProveedores.vehiculoId))
      .leftJoin(proveedores, eq(vehiculoProveedores.proveedorId, proveedores.id))
      .where(whereClause);

    const data = await baseQuery.orderBy(desc(alquileres.creadoEn)).limit(limit).offset(offset);

    const [{ count }] = await database
      .select({ count: sql<number>`count(*)::int` })
      .from(alquileres)
      .leftJoin(clientes, eq(alquileres.clienteId, clientes.id))
      .leftJoin(vehiculos, eq(alquileres.vehiculoId, vehiculos.id))
      .leftJoin(conductores, eq(alquileres.conductorId, conductores.id))
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
        clienteId: alquileres.clienteId,
        vehiculoId: alquileres.vehiculoId,
        conductorId: alquileres.conductorId,

        tipo: alquileres.tipo,

        kilometrajeInicial: alquileres.kilometrajeInicial,
        kilometrajeFinal: alquileres.kilometrajeFinal,

        montoPorDia: alquileres.montoPorDia,
        montoTotalFinal: alquileres.montoTotalFinal,
        razon: alquileres.razon,

        fechaInicio: alquileres.fechaInicio,
        fechaFin: alquileres.fechaFin,
        monto: alquileres.monto,
        observaciones: alquileres.observaciones,
        estado: alquileres.estado,
        creadoEn: alquileres.creadoEn,
        actualizadoEn: alquileres.actualizadoEn,

        cliente: {
          id: clientes.id,
          nombreCompleto: clientes.nombreCompleto,
        },

        vehiculo: {
          id: vehiculos.id,
          placa: vehiculos.placa,
          marca: marcas.nombre,
          modelo: modelos.nombre,
        },
        conductor: {
          id: conductores.id,
          nombreCompleto: conductores.nombreCompleto,
          dni: conductores.dni,
        },
        proveedor: {
          id: proveedores.id,
          nombreCompleto: proveedores.nombreCompleto,
          dni: proveedores.dni,
          ruc: proveedores.ruc,
        },
      })
      .from(alquileres)
      .leftJoin(clientes, eq(alquileres.clienteId, clientes.id))
      .leftJoin(vehiculos, eq(alquileres.vehiculoId, vehiculos.id))
      .leftJoin(conductores, eq(alquileres.conductorId, conductores.id))
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

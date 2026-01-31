import { Injectable } from '@nestjs/common';
import { eq, or, like, and, gte, lte, count, sql, ilike, desc, isNull, getTableColumns, inArray } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { vehiculos, VehiculoDTO } from '@db/tables/vehiculo.table';
import { modelos } from '@db/tables/modelo.table';
import { marcas } from '@db/tables/marca.table';
import { propietarios } from '@db/tables/propietario.table';
import { vehiculoPropietarios } from '@db/tables/vehiculo-propietario.table';
import { proveedores } from '@db/tables/proveedor.table';
import { vehiculoProveedores } from '@db/tables/vehiculo-proveedor.table';

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
      })
      .from(vehiculos)
      .innerJoin(modelos, eq(vehiculos.modeloId, modelos.id))
      .innerJoin(marcas, eq(modelos.marcaId, marcas.id));
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
      .where(whereClause);

    const vehiculosData = await database
      .select({
        ...getTableColumns(vehiculos),
        marca: marcas.nombre,
        modelo: modelos.nombre,
      })
      .from(vehiculos)
      .innerJoin(modelos, eq(vehiculos.modeloId, modelos.id))
      .innerJoin(marcas, eq(modelos.marcaId, marcas.id))
      .where(whereClause)
      .orderBy(desc(vehiculos.creadoEn))
      .limit(limit)
      .offset(offset);

    const data = await Promise.all(
      vehiculosData.map(async (vehiculo) => {
        const owners = await database
          .select({ nombre: propietarios.nombreCompleto })
          .from(vehiculoPropietarios)
          .innerJoin(propietarios, eq(vehiculoPropietarios.propietarioId, propietarios.id))
          .where(eq(vehiculoPropietarios.vehiculoId, vehiculo.id));

        const suppliers = await database
          .select({ nombre: proveedores.nombreCompleto })
          .from(vehiculoProveedores)
          .innerJoin(proveedores, eq(vehiculoProveedores.proveedorId, proveedores.id))
          .where(eq(vehiculoProveedores.vehiculoId, vehiculo.id));

        return {
          ...vehiculo,
          propietarios_nombres: owners.map((o) => o.nombre),
          proveedores_nombres: suppliers.map((s) => s.nombre),
        };
      }),
    );

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
      })
      .from(vehiculos)
      .innerJoin(modelos, eq(vehiculos.modeloId, modelos.id))
      .innerJoin(marcas, eq(modelos.marcaId, marcas.id))
      .where(and(eq(vehiculos.id, id), isNull(vehiculos.eliminadoEn)));

    if (result.length === 0) return null;

    const vehiculo = result[0];

    const owners = await database
      .select({
        id: propietarios.id,
        nombre: propietarios.nombreCompleto,
      })
      .from(vehiculoPropietarios)
      .innerJoin(propietarios, eq(vehiculoPropietarios.propietarioId, propietarios.id))
      .where(eq(vehiculoPropietarios.vehiculoId, id));

    const suppliers = await database
      .select({
        id: proveedores.id,
        nombre: proveedores.nombreCompleto,
      })
      .from(vehiculoProveedores)
      .innerJoin(proveedores, eq(vehiculoProveedores.proveedorId, proveedores.id))
      .where(eq(vehiculoProveedores.vehiculoId, id));

    return {
      ...vehiculo,
      propietarios: owners,
      proveedores: suppliers,
    };
  }

  async create(data: Omit<VehiculoDTO, 'id' | 'creadoEn' | 'actualizadoEn' | 'eliminadoEn'> & { propietarios?: number[]; proveedores?: number[] }) {
    const { propietarios: propietariosIds, proveedores: proveedoresIds, ...vehiculoData } = data;

    return await database.transaction(async (tx) => {
      const [newVehiculo] = await tx
        .insert(vehiculos)
        .values(vehiculoData as any)
        .returning();

      if (propietariosIds && propietariosIds.length > 0) {
        await tx.insert(vehiculoPropietarios).values(
          propietariosIds.map((pid) => ({
            vehiculoId: newVehiculo.id,
            propietarioId: pid,
          })),
        );
      }

      if (proveedoresIds && proveedoresIds.length > 0) {
        await tx.insert(vehiculoProveedores).values(
          proveedoresIds.map((sid) => ({
            vehiculoId: newVehiculo.id,
            proveedorId: sid,
          })),
        );
      }

      return newVehiculo;
    });
  }

  async update(id: number, data: Partial<VehiculoDTO> & { propietarios?: number[]; proveedores?: number[] }) {
    const { propietarios: propietariosIds, proveedores: proveedoresIds, ...vehiculoData } = data;

    return await database.transaction(async (tx) => {
      let updatedVehiculo = undefined;

      // Update vehicle if there is data to update
      if (Object.keys(vehiculoData).length > 0) {
        const [res] = await tx
          .update(vehiculos)
          .set({ ...vehiculoData, actualizadoEn: new Date() })
          .where(eq(vehiculos.id, id))
          .returning();
        updatedVehiculo = res;
      }

      // Update owners if provided
      if (propietariosIds !== undefined) {
        // Delete existing relationships
        await tx.delete(vehiculoPropietarios).where(eq(vehiculoPropietarios.vehiculoId, id));

        // Insert new relationships
        if (propietariosIds.length > 0) {
          await tx.insert(vehiculoPropietarios).values(
            propietariosIds.map((pid) => ({
              vehiculoId: id,
              propietarioId: pid,
            })),
          );
        }
      }

      // Update suppliers if provided
      if (proveedoresIds !== undefined) {
        // Delete existing relationships
        await tx.delete(vehiculoProveedores).where(eq(vehiculoProveedores.vehiculoId, id));

        // Insert new relationships
        if (proveedoresIds.length > 0) {
          await tx.insert(vehiculoProveedores).values(
            proveedoresIds.map((sid) => ({
              vehiculoId: id,
              proveedorId: sid,
            })),
          );
        }
      }

      // If vehicle wasn't updated (only relations), fetch it to return
      if (!updatedVehiculo) {
        const [v] = await tx.select().from(vehiculos).where(eq(vehiculos.id, id));
        updatedVehiculo = v;
      }

      return updatedVehiculo;
    });
  }

  async delete(id: number) {
    const result = await database.update(vehiculos).set({ eliminadoEn: new Date() }).where(eq(vehiculos.id, id)).returning();
    return result[0];
  }
}

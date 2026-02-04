import { Injectable } from '@nestjs/common';
import { eq, like, and, gte, lte, count, sql, isNull, getTableColumns, inArray, desc } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { viajes, ViajeDTO } from '@db/tables/viaje.table';
import { viajeConductores } from '@db/tables/viaje-conductor.table';
import { conductores } from '@db/tables/conductor.table';
import { viajeVehiculos } from '@db/tables/viaje-vehiculo.table';
import { vehiculos } from '@db/tables/vehiculo.table';
import { modelos } from '@db/tables/modelo.table';
import { marcas } from '@db/tables/marca.table';
import { rutas } from '@db/tables/ruta.table';
import { clientes } from '@db/tables/cliente.table';
import { viajeComentarios } from '@db/tables/viaje-comentario.table';
import { usuarios } from '@db/tables/usuario.table';
import { viajeChecklists } from '@db/tables/viaje-checklist.table';

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
  modalidadServicio?: string;
  tipoRuta?: string;
  estado?: string;
  conductoresId?: number[];
}

@Injectable()
export class ViajeRepository {
  async findAll() {
    return await database.select().from(viajes);
  }

  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      conditions.push(like(viajes.rutaOcasional, searchTerm));
    }

    if (filters?.modalidadServicio) {
      conditions.push(eq(sql`${viajes.modalidadServicio}::text`, filters.modalidadServicio));
    }

    if (filters?.tipoRuta) {
      conditions.push(eq(sql`${viajes.tipoRuta}::text`, filters.tipoRuta));
    }

    if (filters?.estado) {
      conditions.push(eq(sql`${viajes.estado}::text`, filters.estado));
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(viajes.fechaSalida, new Date(filters.fechaInicio)));
      conditions.push(lte(viajes.fechaSalida, new Date(filters.fechaFin + 'T23:59:59')));
    } else if (filters?.fechaInicio) {
      conditions.push(gte(viajes.fechaSalida, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(viajes.fechaSalida, new Date(filters.fechaFin + 'T23:59:59')));
    }

    // Filtrar por conductores
    if (filters?.conductoresId && filters.conductoresId.length > 0) {
      // Subconsulta para obtener los IDs de viajes que tienen estos conductores
      const viajesConConductores = database
        .select({ viajeId: viajeConductores.viajeId })
        .from(viajeConductores)
        .where(inArray(viajeConductores.conductorId, filters.conductoresId));

      conditions.push(inArray(viajes.id, viajesConConductores));
    }

    // Excluir eliminados
    conditions.push(isNull(viajes.eliminadoEn));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database.select({ total: count() }).from(viajes).where(whereClause);

    const data = await database
      .select({
        ...getTableColumns(viajes),
        conductorPrincipal: {
          ...getTableColumns(conductores),
        },
        vehiculoPrincipal: {
          ...getTableColumns(vehiculos),
          marca: marcas.nombre,
          modelo: modelos.nombre,
        },
        ruta: {
          ...getTableColumns(rutas),
        },
        cliente: {
          ...getTableColumns(clientes),
        },
      })
      .from(viajes)
      .leftJoin(rutas, eq(rutas.id, viajes.rutaId))
      .leftJoin(clientes, eq(clientes.id, viajes.clienteId))
      .leftJoin(viajeConductores, and(eq(viajeConductores.viajeId, viajes.id), eq(viajeConductores.esPrincipal, true)))
      .leftJoin(conductores, eq(conductores.id, viajeConductores.conductorId))
      .leftJoin(viajeVehiculos, and(eq(viajeVehiculos.viajeId, viajes.id), eq(viajeVehiculos.esPrincipal, true)))
      .leftJoin(vehiculos, eq(vehiculos.id, viajeVehiculos.vehiculoId))
      .leftJoin(modelos, eq(vehiculos.modeloId, modelos.id))
      .leftJoin(marcas, eq(modelos.marcaId, marcas.id))
      .where(whereClause)
      .orderBy(desc(viajes.fechaSalida))
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
        viaje: getTableColumns(viajes),
        cliente: getTableColumns(clientes),
        ruta: getTableColumns(rutas),
      })
      .from(viajes)
      .leftJoin(clientes, eq(clientes.id, viajes.clienteId))
      .leftJoin(rutas, eq(rutas.id, viajes.rutaId))
      .where(and(eq(viajes.id, id), isNull(viajes.eliminadoEn)))
      .limit(1);

    if (result.length === 0) return null;

    const { viaje, cliente, ruta } = result[0];

    const conductorsQuery = database
      .select({
        ...getTableColumns(conductores),
        rol: viajeConductores.rol,
        esPrincipal: viajeConductores.esPrincipal,
      })
      .from(viajeConductores)
      .innerJoin(conductores, eq(conductores.id, viajeConductores.conductorId))
      .where(eq(viajeConductores.viajeId, id));

    const vehiculosQuery = database
      .select({
        ...getTableColumns(vehiculos),
        marca: marcas.nombre,
        modelo: modelos.nombre,
        rol: viajeVehiculos.rol,
        esPrincipal: viajeVehiculos.esPrincipal,
      })
      .from(viajeVehiculos)
      .innerJoin(vehiculos, eq(vehiculos.id, viajeVehiculos.vehiculoId))
      .innerJoin(modelos, eq(vehiculos.modeloId, modelos.id))
      .innerJoin(marcas, eq(modelos.marcaId, marcas.id))
      .where(eq(viajeVehiculos.viajeId, id));

    const comentariosQuery = database
      .select({
        ...getTableColumns(viajeComentarios),
        usuarioNombreCompleto: usuarios.nombreCompleto,
        usuarioId: usuarios.id,
      })
      .from(viajeComentarios)
      .leftJoin(usuarios, eq(usuarios.id, viajeComentarios.usuarioId))
      .where(eq(viajeComentarios.viajeId, id));

    // Consulta optimizada para checklists - solo tipo y validadoEn
    const checklistsQuery = database
      .select({
        tipo: viajeChecklists.tipo,
        validadoEn: viajeChecklists.validadoEn,
      })
      .from(viajeChecklists)
      .where(eq(viajeChecklists.viajeId, id));

    const [conductoresList, vehiculosList, comentariosList, checklistsList] = await Promise.all([
      conductorsQuery,
      vehiculosQuery,
      comentariosQuery,
      checklistsQuery,
    ]);

    // Determinar estados de validación
    let checkInSalida = false;
    let checkInLlegada = false;
    for (const checklist of checklistsList) {
      if (checklist.tipo === 'salida' && checklist.validadoEn !== null) checkInSalida = true;
      if (checklist.tipo === 'llegada' && checklist.validadoEn !== null) checkInLlegada = true;
    }

    return {
      ...viaje,
      cliente: cliente || null,
      ruta: ruta || null,
      conductores: conductoresList,
      vehiculos: vehiculosList,
      comentarios: comentariosList,
      checkInSalida,
      checkInLlegada,
    };
  }

  async create(data: ViajeDTO) {
    const result = await database.insert(viajes).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<ViajeDTO>) {
    const result = await database
      .update(viajes)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(viajes.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.update(viajes).set({ eliminadoEn: new Date() }).where(eq(viajes.id, id)).returning();
    return result[0];
  }
}

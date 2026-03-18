import { Injectable } from '@nestjs/common';
import { database } from '@db/connection.db';
import { vehiculos } from '@db/tables/vehiculo.table';
import { modelos } from '@db/tables/modelo.table';
import { marcas } from '@db/tables/marca.table';
import { viajes } from '@db/tables/viaje.table';
import { viajeVehiculos } from '@db/tables/viaje-vehiculo.table';
import { viajeConductores } from '@db/tables/viaje-conductor.table';
import { rutas } from '@db/tables/ruta.table';
import { eq, desc, and, gte, lte, sql, isNull, or } from 'drizzle-orm';
import { viajeCircuitos } from '@db/tables/viaje-circuito.table';
import { mantenimientos } from '@db/tables/mantenimiento.table';
import { talleres } from '@db/tables/taller.table';
import { conductores } from '@db/tables/conductor.table';
import { conductorDocumentos } from '@db/tables/conductor-documento.table';
import { clientes } from '@db/tables/cliente.table';
import { entidades } from '@db/tables/entidad.table';

@Injectable()
export class ReportesRepository {
  // ========== CAMPOS COMUNES DE VIAJES DETALLADOS ==========

  private get viajeSelectFields() {
    return {
      id: viajes.id,
      tipoRuta: viajes.tipoRuta,
      rutaOcasional: viajes.rutaOcasional,
      rutaOrigen: rutas.origen,
      rutaDestino: rutas.destino,
      distanciaEstimada: viajes.distanciaEstimada,
      distanciaFinal: viajes.distanciaFinal,
      diferencia: sql<number>`COALESCE(CAST(${viajes.distanciaFinal} AS DECIMAL) - CAST(${viajes.distanciaEstimada} AS DECIMAL), 0)`.mapWith(
        Number,
      ),
      horasContrato: viajes.horasContrato,
      horasTotales: sql<number>`
        CASE 
          WHEN ${viajes.fechaLlegada} IS NOT NULL THEN 
            ROUND(CAST(EXTRACT(EPOCH FROM (${viajes.fechaLlegada} - ${viajes.fechaSalida})) / 3600 AS NUMERIC), 2)
          ELSE 0 
        END`.mapWith(Number),
      horasExcedidas: sql<number>`
        CASE 
          WHEN ${viajes.fechaLlegada} IS NOT NULL THEN 
            GREATEST(0, ROUND(CAST((EXTRACT(EPOCH FROM (${viajes.fechaLlegada} - ${viajes.fechaSalida})) / 3600) - CAST(${viajes.horasContrato} AS NUMERIC) AS NUMERIC), 2))
          ELSE 0 
        END`.mapWith(Number),
      estado: viajes.estado,
      modalidadServicio: viajes.modalidadServicio,
      turno: viajes.turno,
      numeroVale: viajes.numeroVale,
      fechaSalidaProgramada: viajes.fechaSalidaProgramada,
      fechaLlegadaProgramada: viajes.fechaLlegadaProgramada,
      fechaSalida: viajes.fechaSalida,
      fechaLlegada: viajes.fechaLlegada,
      circuitoId: viajeCircuitos.id,
      sentido: viajes.sentido,
      // Datos del vehículo principal
      vehiculoPlaca: vehiculos.placa,
      vehiculoMarca: marcas.nombre,
      vehiculoModelo: modelos.nombre,
      // Datos del conductor principal
      conductorNombre: conductores.nombreCompleto,
      conductorDni: conductores.dni,
      // Datos del cliente
      clienteNombre: sql<string>`COALESCE(NULLIF(TRIM(${clientes.razonSocial}), ''), ${clientes.nombreCompleto})`,
      clienteDocumento: sql<string>`COALESCE(${clientes.ruc}, ${clientes.dni}, '')`,
      // Datos de la entidad
      entidadNombre: entidades.nombreServicio,
    };
  }

  // ========== REPORTES DETALLADOS ==========

  async getViajesDetalladosPorVehiculo(vehiculoId: number, fechaInicio?: Date, fechaFin?: Date) {
    const filters = [eq(viajeVehiculos.vehiculoId, vehiculoId), isNull(viajes.eliminadoEn)];

    if (fechaInicio) filters.push(gte(viajes.fechaSalidaProgramada, fechaInicio));
    if (fechaFin) filters.push(lte(viajes.fechaSalidaProgramada, fechaFin));

    return await database
      .select(this.viajeSelectFields)
      .from(viajes)
      .innerJoin(
        viajeCircuitos,
        and(or(eq(viajeCircuitos.viajeIdaId, viajes.id), eq(viajeCircuitos.viajeVueltaId, viajes.id)), isNull(viajeCircuitos.eliminadoEn)),
      )
      .innerJoin(viajeVehiculos, and(eq(viajes.id, viajeVehiculos.viajeId), eq(viajeVehiculos.esPrincipal, true)))
      .leftJoin(vehiculos, eq(viajeVehiculos.vehiculoId, vehiculos.id))
      .leftJoin(modelos, eq(vehiculos.modeloId, modelos.id))
      .leftJoin(marcas, eq(modelos.marcaId, marcas.id))
      .leftJoin(viajeConductores, and(eq(viajes.id, viajeConductores.viajeId), eq(viajeConductores.esPrincipal, true)))
      .leftJoin(conductores, eq(viajeConductores.conductorId, conductores.id))
      .leftJoin(rutas, eq(viajes.rutaId, rutas.id))
      .innerJoin(clientes, eq(viajes.clienteId, clientes.id))
      .leftJoin(entidades, eq(viajes.entidadId, entidades.id))
      .where(and(...filters))
      .orderBy(desc(viajeCircuitos.id), viajes.fechaSalidaProgramada);
  }

  async getViajesDetalladosPorConductor(conductorId: number, fechaInicio?: Date, fechaFin?: Date) {
    const filters = [eq(viajeConductores.conductorId, conductorId), isNull(viajes.eliminadoEn)];

    if (fechaInicio) filters.push(gte(viajes.fechaSalidaProgramada, fechaInicio));
    if (fechaFin) filters.push(lte(viajes.fechaSalidaProgramada, fechaFin));

    return await database
      .select(this.viajeSelectFields)
      .from(viajes)
      .innerJoin(
        viajeCircuitos,
        and(or(eq(viajeCircuitos.viajeIdaId, viajes.id), eq(viajeCircuitos.viajeVueltaId, viajes.id)), isNull(viajeCircuitos.eliminadoEn)),
      )
      .innerJoin(viajeConductores, and(eq(viajes.id, viajeConductores.viajeId), eq(viajeConductores.esPrincipal, true)))
      .leftJoin(conductores, eq(viajeConductores.conductorId, conductores.id))
      .leftJoin(viajeVehiculos, and(eq(viajes.id, viajeVehiculos.viajeId), eq(viajeVehiculos.esPrincipal, true)))
      .leftJoin(vehiculos, eq(viajeVehiculos.vehiculoId, vehiculos.id))
      .leftJoin(modelos, eq(vehiculos.modeloId, modelos.id))
      .leftJoin(marcas, eq(modelos.marcaId, marcas.id))
      .leftJoin(rutas, eq(viajes.rutaId, rutas.id))
      .innerJoin(clientes, eq(viajes.clienteId, clientes.id))
      .leftJoin(entidades, eq(viajes.entidadId, entidades.id))
      .where(and(...filters))
      .orderBy(desc(viajeCircuitos.id), viajes.fechaSalidaProgramada);
  }

  async getViajesDetalladosPorCliente(clienteId: number, fechaInicio?: Date, fechaFin?: Date) {
    const filters = [eq(viajes.clienteId, clienteId), isNull(viajes.eliminadoEn)];

    if (fechaInicio) filters.push(gte(viajes.fechaSalidaProgramada, fechaInicio));
    if (fechaFin) filters.push(lte(viajes.fechaSalidaProgramada, fechaFin));

    return await database
      .select(this.viajeSelectFields)
      .from(viajes)
      .innerJoin(
        viajeCircuitos,
        and(or(eq(viajeCircuitos.viajeIdaId, viajes.id), eq(viajeCircuitos.viajeVueltaId, viajes.id)), isNull(viajeCircuitos.eliminadoEn)),
      )
      .leftJoin(viajeVehiculos, and(eq(viajes.id, viajeVehiculos.viajeId), eq(viajeVehiculos.esPrincipal, true)))
      .leftJoin(vehiculos, eq(viajeVehiculos.vehiculoId, vehiculos.id))
      .leftJoin(modelos, eq(vehiculos.modeloId, modelos.id))
      .leftJoin(marcas, eq(modelos.marcaId, marcas.id))
      .leftJoin(viajeConductores, and(eq(viajes.id, viajeConductores.viajeId), eq(viajeConductores.esPrincipal, true)))
      .leftJoin(conductores, eq(viajeConductores.conductorId, conductores.id))
      .leftJoin(rutas, eq(viajes.rutaId, rutas.id))
      .innerJoin(clientes, eq(viajes.clienteId, clientes.id))
      .leftJoin(entidades, eq(viajes.entidadId, entidades.id))
      .where(and(...filters))
      .orderBy(desc(viajeCircuitos.id), viajes.fechaSalidaProgramada);
  }

  async getMantenimientosDetalladosPorVehiculo(vehiculoId: number, fechaInicio?: Date, fechaFin?: Date) {
    const filters = [eq(mantenimientos.vehiculoId, vehiculoId), isNull(mantenimientos.eliminadoEn)];

    if (fechaInicio) filters.push(gte(mantenimientos.fechaIngreso, fechaInicio));
    if (fechaFin) filters.push(lte(mantenimientos.fechaIngreso, fechaFin));

    return await database
      .select({
        id: mantenimientos.id,
        codigoOrden: mantenimientos.codigoOrden,
        tipo: mantenimientos.tipo,
        estado: mantenimientos.estado,
        descripcion: mantenimientos.descripcion,
        kilometraje: mantenimientos.kilometraje,
        costoTotal: mantenimientos.costoTotal,
        fechaIngreso: mantenimientos.fechaIngreso,
        fechaSalida: mantenimientos.fechaSalida,
        tallerNombre: talleres.razonSocial,
        tallerTipo: talleres.tipo,
      })
      .from(mantenimientos)
      .innerJoin(talleres, eq(mantenimientos.tallerId, talleres.id))
      .where(and(...filters))
      .orderBy(desc(mantenimientos.fechaIngreso));
  }

  async getMantenimientosDetalladosPorTaller(tallerId: number, fechaInicio?: Date, fechaFin?: Date) {
    const filters = [eq(mantenimientos.tallerId, tallerId), isNull(mantenimientos.eliminadoEn)];

    if (fechaInicio) filters.push(gte(mantenimientos.fechaIngreso, fechaInicio));
    if (fechaFin) filters.push(lte(mantenimientos.fechaIngreso, fechaFin));

    return await database
      .select({
        id: mantenimientos.id,
        codigoOrden: mantenimientos.codigoOrden,
        tipo: mantenimientos.tipo,
        estado: mantenimientos.estado,
        descripcion: mantenimientos.descripcion,
        kilometraje: mantenimientos.kilometraje,
        costoTotal: mantenimientos.costoTotal,
        fechaIngreso: mantenimientos.fechaIngreso,
        fechaSalida: mantenimientos.fechaSalida,
        vehiculoPlaca: vehiculos.placa,
        vehiculoMarca: marcas.nombre,
        vehiculoModelo: modelos.nombre,
      })
      .from(mantenimientos)
      .innerJoin(vehiculos, eq(mantenimientos.vehiculoId, vehiculos.id))
      .innerJoin(modelos, eq(vehiculos.modeloId, modelos.id))
      .innerJoin(marcas, eq(modelos.marcaId, marcas.id))
      .where(and(...filters))
      .orderBy(desc(mantenimientos.fechaIngreso));
  }

  async getReporteConductores() {
    return await database
      .select({
        id: conductores.id,
        dni: conductores.dni,
        nombres: conductores.nombres,
        apellidos: conductores.apellidos,
        numeroLicencia: conductores.numeroLicencia,
        claseLicencia: conductores.claseLicencia,
        categoriaLicencia: conductores.categoriaLicencia,
        documentoTipo: conductorDocumentos.tipo,
        documentoFechaExpiracion: conductorDocumentos.fechaExpiracion,
        documentoFechaEmision: conductorDocumentos.fechaEmision,
      })
      .from(conductores)
      .leftJoin(conductorDocumentos, eq(conductores.id, conductorDocumentos.conductorId))
      .where(isNull(conductores.eliminadoEn))
      .orderBy(conductores.apellidos, conductores.nombres);
  }
}

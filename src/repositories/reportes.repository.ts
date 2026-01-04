import { Injectable } from '@nestjs/common';
import { database } from '@db/connection.db';
import { vehiculos } from '@model/tables/vehiculo.model';
import { modelos } from '@model/tables/modelo.model';
import { marcas } from '@model/tables/marca.model';
import { viajes } from '@model/tables/viaje.model';
import { viajeVehiculos } from '@model/tables/viaje-vehiculo.model';
import { viajeConductores } from '@model/tables/viaje-conductor.model';
import { rutas } from '@model/tables/ruta.model';
import { eq, desc, and, gte, lte, sql } from 'drizzle-orm';
import { mantenimientos } from '@model/tables/mantenimiento.model';
import { talleres } from '@model/tables/taller.model';
import { conductores } from '@model/tables/conductor.model';
import { conductorDocumentos } from '@model/tables/conductor-documento.model';

@Injectable()
export class ReportesRepository {
  // ========== REPORTES DETALLADOS ==========

  async getViajesDetalladosPorVehiculo(vehiculoId: number, fechaInicio?: Date, fechaFin?: Date) {
    const filters = [eq(viajeVehiculos.vehiculoId, vehiculoId)];

    if (fechaInicio) filters.push(gte(viajes.fechaSalida, fechaInicio));
    if (fechaFin) filters.push(lte(viajes.fechaSalida, fechaFin));

    return await database
      .select({
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
        fechaSalida: viajes.fechaSalida,
        fechaLlegada: viajes.fechaLlegada,
      })
      .from(viajes)
      .innerJoin(viajeVehiculos, eq(viajes.id, viajeVehiculos.viajeId))
      .leftJoin(rutas, eq(viajes.rutaId, rutas.id))
      .where(and(...filters))
      .orderBy(desc(viajes.fechaSalida));
  }

  async getViajesDetalladosPorConductor(conductorId: number, fechaInicio?: Date, fechaFin?: Date) {
    const filters = [eq(viajeConductores.conductorId, conductorId)];

    if (fechaInicio) filters.push(gte(viajes.fechaSalida, fechaInicio));
    if (fechaFin) filters.push(lte(viajes.fechaSalida, fechaFin));

    return await database
      .select({
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
        fechaSalida: viajes.fechaSalida,
        fechaLlegada: viajes.fechaLlegada,
      })
      .from(viajes)
      .innerJoin(viajeConductores, eq(viajes.id, viajeConductores.viajeId))
      .leftJoin(rutas, eq(viajes.rutaId, rutas.id))
      .where(and(...filters))
      .orderBy(desc(viajes.fechaSalida));
  }

  async getViajesDetalladosPorCliente(clienteId: number, fechaInicio?: Date, fechaFin?: Date) {
    const filters = [eq(viajes.clienteId, clienteId)];

    if (fechaInicio) filters.push(gte(viajes.fechaSalida, fechaInicio));
    if (fechaFin) filters.push(lte(viajes.fechaSalida, fechaFin));

    return await database
      .select({
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
        fechaSalida: viajes.fechaSalida,
        fechaLlegada: viajes.fechaLlegada,
      })
      .from(viajes)
      .leftJoin(rutas, eq(viajes.rutaId, rutas.id))
      .where(and(...filters))
      .orderBy(desc(viajes.fechaSalida));
  }

  async getMantenimientosDetalladosPorVehiculo(vehiculoId: number, fechaInicio?: Date, fechaFin?: Date) {
    const filters = [eq(mantenimientos.vehiculoId, vehiculoId)];

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
    const filters = [eq(mantenimientos.tallerId, tallerId)];

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
      .where(sql`${conductores.eliminadoEn} IS NULL`)
      .orderBy(conductores.apellidos, conductores.nombres);
  }
}

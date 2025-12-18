import { Injectable } from "@nestjs/common";
import { database } from "@db/connection.db";
import { vehiculos } from "@model/tables/vehiculo.model";
import { conductores } from "@model/tables/conductor.model";
import { viajes } from "@model/tables/viaje.model";
import { viajeVehiculos } from "@model/tables/viaje-vehiculo.model";
import { viajeConductores } from "@model/tables/viaje-conductor.model";
import { rutas } from "@model/tables/ruta.model";
import { count, eq, sum, desc, and, gte, lte, sql } from "drizzle-orm";

@Injectable()
export class ReportesRepository {
  async getViajesPorVehiculo(fechaInicio?: Date, fechaFin?: Date) {
    const filters = [];

    if (fechaInicio) filters.push(gte(viajes.fechaSalida, fechaInicio));
    if (fechaFin) filters.push(lte(viajes.fechaSalida, fechaFin));

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    return await database
      .select({
        vehiculoId: vehiculos.id,
        placa: vehiculos.placa,
        marca: vehiculos.marca,
        modelo: vehiculos.modelo,
        totalViajes: count(viajes.id),
      })
      .from(vehiculos)
      .leftJoin(viajeVehiculos, eq(vehiculos.id, viajeVehiculos.vehiculoId))
      .leftJoin(viajes, eq(viajeVehiculos.viajeId, viajes.id))
      .where(whereClause)
      .groupBy(vehiculos.id, vehiculos.placa, vehiculos.marca, vehiculos.modelo)
      .orderBy(desc(count(viajes.id)));
  }

  async getViajesPorConductor(fechaInicio?: Date, fechaFin?: Date) {
    const filters = [];

    if (fechaInicio) filters.push(gte(viajes.fechaSalida, fechaInicio));
    if (fechaFin) filters.push(lte(viajes.fechaSalida, fechaFin));

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    return await database
      .select({
        conductorId: conductores.id,
        nombreCompleto: conductores.nombreCompleto,
        dni: conductores.dni, // Assuming dni exists or similar identifier
        totalViajes: count(viajes.id),
      })
      .from(conductores)
      .leftJoin(
        viajeConductores,
        eq(conductores.id, viajeConductores.conductorId)
      )
      .leftJoin(viajes, eq(viajeConductores.viajeId, viajes.id))
      .where(whereClause)
      .groupBy(conductores.id, conductores.nombreCompleto, conductores.dni)
      .orderBy(desc(count(viajes.id)));
  }

  // ========== REPORTES DETALLADOS ==========

  async getViajesDetalladosPorVehiculo(
    vehiculoId: number,
    fechaInicio?: Date,
    fechaFin?: Date
  ) {
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
        distancia: rutas.distancia,
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

  async getViajesDetalladosPorConductor(
    conductorId: number,
    fechaInicio?: Date,
    fechaFin?: Date
  ) {
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
        distancia: rutas.distancia,
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

  async getViajesDetalladosPorCliente(
    clienteId: number,
    fechaInicio?: Date,
    fechaFin?: Date
  ) {
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
        distancia: rutas.distancia,
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

  async getKilometrajePorVehiculo(fechaInicio?: Date, fechaFin?: Date) {
    const filters = [
      eq(viajes.tipoRuta, "fija"), // Only fixed routes have defined distance in 'rutas' table
      eq(viajes.estado, "completado"), // Only count completed trips
    ];

    if (fechaInicio) filters.push(gte(viajes.fechaSalida, fechaInicio));
    if (fechaFin) filters.push(lte(viajes.fechaSalida, fechaFin));

    const whereClause = and(...filters);

    // Sum distance of routes associated with trips taken by vehicle
    return await database
      .select({
        vehiculoId: vehiculos.id,
        placa: vehiculos.placa,
        totalKilometros: sql<number>`SUM(${rutas.distancia})`.mapWith(Number),
        totalViajes: count(viajes.id),
      })
      .from(vehiculos)
      .innerJoin(viajeVehiculos, eq(vehiculos.id, viajeVehiculos.vehiculoId))
      .innerJoin(viajes, eq(viajeVehiculos.viajeId, viajes.id))
      .innerJoin(rutas, eq(viajes.rutaId, rutas.id))
      .where(whereClause)
      .groupBy(vehiculos.id, vehiculos.placa)
      .orderBy(desc(sql`SUM(${rutas.distancia})`));
  }
}

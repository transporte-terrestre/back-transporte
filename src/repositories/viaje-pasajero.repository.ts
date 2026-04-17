import { Injectable } from '@nestjs/common';
import { eq, and, inArray, sql, isNull } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { database } from '@db/connection.db';
import { viajePasajeros, ViajePasajeroDTO } from '@db/tables/viaje-pasajero.table';
import { pasajeros } from '@db/tables/pasajero.table';
import { viajePasajeroMovimientos } from '@db/tables/viaje-pasajero-movimiento.table';
import { viajeTramos } from '@db/tables/viaje-tramo.table';

@Injectable()
export class ViajePasajeroRepository {
  async findByViajeId(viajeId: number, viajeTramoId?: number) {
    const movEntrada = viajePasajeroMovimientos;
    const movSalida = alias(viajePasajeroMovimientos, 'mov_salida');
    const tramoEntrada = viajeTramos;
    const tramoSalida = alias(viajeTramos, 'tramo_salida');

    // Filtro temporal: solo movimientos de tramos con horaFinal <= horaFinal del tramo consultado
    const timeFilter = viajeTramoId
      ? sql`IN (SELECT id FROM viaje_tramos WHERE hora_final <= (SELECT hora_final FROM viaje_tramos WHERE id = ${viajeTramoId}))`
      : undefined;

    const entradaJoinConditions = [
      eq(movEntrada.viajePasajeroId, viajePasajeros.id),
      eq(movEntrada.tipoMovimiento, 'entrada'),
      isNull(movEntrada.eliminadoEn),
    ];
    if (timeFilter) {
      entradaJoinConditions.push(sql`${movEntrada.viajeTramoId} ${timeFilter}`);
    }

    const salidaJoinConditions = [
      eq(movSalida.viajePasajeroId, viajePasajeros.id),
      eq(movSalida.tipoMovimiento, 'salida'),
      isNull(movSalida.eliminadoEn),
    ];
    if (timeFilter) {
      salidaJoinConditions.push(sql`${movSalida.viajeTramoId} ${timeFilter}`);
    }

    const query = database
      .select({
        id: viajePasajeros.id,
        viajeId: viajePasajeros.viajeId,
        pasajeroId: viajePasajeros.pasajeroId,
        dni: sql<string | null>`COALESCE(${pasajeros.dni}, ${viajePasajeros.dni})`.as('dni'),
        nombres: sql<string | null>`COALESCE(${pasajeros.nombres}, ${viajePasajeros.nombres})`.as('nombres'),
        apellidos: sql<string | null>`COALESCE(${pasajeros.apellidos}, ${viajePasajeros.apellidos})`.as('apellidos'),
        empresa: viajePasajeros.empresa,
        asistencia: viajeTramoId ? sql<boolean>`CASE WHEN ${movEntrada.id} IS NOT NULL THEN TRUE ELSE FALSE END` : viajePasajeros.asistencia,
        // Entrada
        paradaAsistenciaId: sql<number | null>`${movEntrada.viajeTramoId}`.as('parada_asistencia_id'),
        paradaAsistenciaNombre: sql<string | null>`${tramoEntrada.nombreLugar}`.as('parada_asistencia_nombre'),
        horaAsistencia: sql<string | null>`${movEntrada.hora}`.as('hora_asistencia'),
        esAsistenciaTramoActual: viajeTramoId
          ? sql<boolean>`CASE WHEN ${movEntrada.viajeTramoId} = ${viajeTramoId} THEN TRUE ELSE FALSE END`.as('es_asistencia_tramo_actual')
          : sql<null>`NULL`.as('es_asistencia_tramo_actual'),
        // Salida
        paradaSalidaId: sql<number | null>`${movSalida.viajeTramoId}`.as('parada_salida_id'),
        paradaSalidaNombre: sql<string | null>`${tramoSalida.nombreLugar}`.as('parada_salida_nombre'),
        horaSalida: sql<string | null>`${movSalida.hora}`.as('hora_salida'),
        esSalidaTramoActual: viajeTramoId
          ? sql<boolean>`CASE WHEN ${movSalida.viajeTramoId} = ${viajeTramoId} THEN TRUE ELSE FALSE END`.as('es_salida_tramo_actual')
          : sql<null>`NULL`.as('es_salida_tramo_actual'),
        creadoEn: viajePasajeros.creadoEn,
        actualizadoEn: viajePasajeros.actualizadoEn,
      })
      .from(viajePasajeros)
      .leftJoin(pasajeros, eq(viajePasajeros.pasajeroId, pasajeros.id))
      // JOIN entrada
      .leftJoin(movEntrada, and(...entradaJoinConditions))
      .leftJoin(tramoEntrada, eq(movEntrada.viajeTramoId, tramoEntrada.id))
      // JOIN salida
      .leftJoin(movSalida, and(...salidaJoinConditions))
      .leftJoin(tramoSalida, eq(movSalida.viajeTramoId, tramoSalida.id));

    return await query.where(eq(viajePasajeros.viajeId, viajeId));
  }

  async findOne(id: number) {
    const movEntradaGlobal = viajePasajeroMovimientos;

    const results = await database
      .select({
        id: viajePasajeros.id,
        viajeId: viajePasajeros.viajeId,
        pasajeroId: viajePasajeros.pasajeroId,
        dni: sql<string | null>`COALESCE(${pasajeros.dni}, ${viajePasajeros.dni})`.as('dni'),
        nombres: sql<string | null>`COALESCE(${pasajeros.nombres}, ${viajePasajeros.nombres})`.as('nombres'),
        apellidos: sql<string | null>`COALESCE(${pasajeros.apellidos}, ${viajePasajeros.apellidos})`.as('apellidos'),
        empresa: viajePasajeros.empresa,
        asistencia: viajePasajeros.asistencia,
        paradaAsistenciaId: sql<number | null>`${movEntradaGlobal.viajeTramoId}`.as('parada_asistencia_id'),
        paradaAsistenciaNombre: sql<string | null>`${viajeTramos.nombreLugar}`.as('parada_asistencia_nombre'),
        creadoEn: viajePasajeros.creadoEn,
        actualizadoEn: viajePasajeros.actualizadoEn,
      })
      .from(viajePasajeros)
      .leftJoin(pasajeros, eq(viajePasajeros.pasajeroId, pasajeros.id))
      .leftJoin(
        movEntradaGlobal,
        and(
          eq(movEntradaGlobal.viajePasajeroId, viajePasajeros.id),
          eq(movEntradaGlobal.tipoMovimiento, 'entrada'),
          isNull(movEntradaGlobal.eliminadoEn),
        ),
      )
      .leftJoin(viajeTramos, eq(movEntradaGlobal.viajeTramoId, viajeTramos.id))
      .where(eq(viajePasajeros.id, id))
      .limit(1);

    return results[0] || null;
  }

  async addPasajeros(data: ViajePasajeroDTO[]) {
    if (data.length === 0) return [];

    // Separamos los pasajeros en los que tienen pasajeroId y los que tienen dni (ad-hoc)
    const withPasajeroId = data.filter((p) => p.pasajeroId);
    const withDniOnly = data.filter((p) => !p.pasajeroId && p.dni);

    const results = [];

    if (withPasajeroId.length > 0) {
      const res = await database
        .insert(viajePasajeros)
        .values(withPasajeroId)
        .onConflictDoUpdate({
          target: [viajePasajeros.viajeId, viajePasajeros.pasajeroId],
          set: {
            asistencia: sql`excluded.asistencia`,
            empresa: sql`excluded.empresa`,
            actualizadoEn: new Date(),
          },
        })
        .returning();
      results.push(...res);
    }

    if (withDniOnly.length > 0) {
      const res = await database
        .insert(viajePasajeros)
        .values(withDniOnly)
        .onConflictDoUpdate({
          target: [viajePasajeros.viajeId, viajePasajeros.dni],
          set: {
            asistencia: sql`excluded.asistencia`,
            nombres: sql`excluded.nombres`,
            apellidos: sql`excluded.apellidos`,
            empresa: sql`excluded.empresa`,
            actualizadoEn: new Date(),
          },
        })
        .returning();
      results.push(...res);
    }

    return results;
  }

  async removePasajeros(viajeId: number, ids: number[]) {
    if (ids.length === 0) return;
    return await database
      .delete(viajePasajeros)
      .where(and(eq(viajePasajeros.viajeId, viajeId), inArray(viajePasajeros.id, ids)))
      .returning();
  }

  async removeAllByViajeId(viajeId: number) {
    return await database.delete(viajePasajeros).where(eq(viajePasajeros.viajeId, viajeId));
  }

  async updateAsistencia(id: number, asistencia: boolean) {
    return await database.update(viajePasajeros).set({ asistencia, actualizadoEn: new Date() }).where(eq(viajePasajeros.id, id)).returning();
  }
}

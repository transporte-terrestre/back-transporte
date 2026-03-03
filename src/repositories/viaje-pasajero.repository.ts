import { Injectable } from '@nestjs/common';
import { eq, and, inArray, sql, isNull } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { viajePasajeros, ViajePasajeroDTO } from '@db/tables/viaje-pasajero.table';
import { pasajeros } from '@db/tables/pasajero.table';
import { viajePasajeroMovimientos } from '@db/tables/viaje-pasajero-movimiento.table';
import { viajeTramos } from '@db/tables/viaje-tramo.table';

@Injectable()
export class ViajePasajeroRepository {
  async findByViajeId(viajeId: number, viajeTramoId?: number) {
    // Alias para el movimiento de entrada global (en cualquier parada)
    const movEntradaGlobal = viajePasajeroMovimientos;

    const query = database
      .select({
        id: viajePasajeros.id,
        viajeId: viajePasajeros.viajeId,
        pasajeroId: viajePasajeros.pasajeroId,
        // Priorizar datos del pasajero registrado, fallback a datos ad-hoc
        dni: sql<string | null>`COALESCE(${pasajeros.dni}, ${viajePasajeros.dni})`.as('dni'),
        nombres: sql<string | null>`COALESCE(${pasajeros.nombres}, ${viajePasajeros.nombres})`.as('nombres'),
        apellidos: sql<string | null>`COALESCE(${pasajeros.apellidos}, ${viajePasajeros.apellidos})`.as('apellidos'),
        asistencia: viajeTramoId
          ? sql<boolean>`CASE WHEN ${viajePasajeroMovimientos.id} IS NOT NULL THEN TRUE ELSE FALSE END`
          : viajePasajeros.asistencia,
        // Parada donde tiene asistencia (si tiene entrada en alguna parada)
        paradaAsistenciaId: sql<number | null>`${movEntradaGlobal.viajeTramoId}`.as('parada_asistencia_id'),
        paradaAsistenciaNombre: sql<string | null>`${viajeTramos.nombreLugar}`.as('parada_asistencia_nombre'),
        // Booleano: ¿la asistencia coincide con el tramo actual consultado?
        esTramoActual: viajeTramoId
          ? sql<boolean>`CASE WHEN ${movEntradaGlobal.viajeTramoId} = ${viajeTramoId} THEN TRUE ELSE FALSE END`.as('es_tramo_actual')
          : sql<null>`NULL`.as('es_tramo_actual'),
        creadoEn: viajePasajeros.creadoEn,
        actualizadoEn: viajePasajeros.actualizadoEn,
      })
      .from(viajePasajeros)
      .leftJoin(pasajeros, eq(viajePasajeros.pasajeroId, pasajeros.id))
      // JOIN para obtener el movimiento de entrada global (en cualquier parada)
      .leftJoin(
        movEntradaGlobal,
        and(
          eq(movEntradaGlobal.viajePasajeroId, viajePasajeros.id),
          eq(movEntradaGlobal.tipoMovimiento, 'entrada'),
          isNull(movEntradaGlobal.eliminadoEn),
        ),
      )
      // JOIN al tramo para obtener el nombre de la parada
      .leftJoin(viajeTramos, eq(movEntradaGlobal.viajeTramoId, viajeTramos.id));

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

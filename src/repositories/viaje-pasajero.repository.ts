import { Injectable } from '@nestjs/common';
import { eq, and, inArray, sql, isNull } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { viajePasajeros, ViajePasajeroDTO } from '@db/tables/viaje-pasajero.table';
import { pasajeros } from '@db/tables/pasajero.table';
import { viajePasajeroMovimientos } from '@db/tables/viaje-pasajero-movimiento.table';

@Injectable()
export class ViajePasajeroRepository {
  async findByViajeId(viajeId: number, viajeTramoId?: number) {
    const query = database
      .select({
        id: viajePasajeros.id,
        viajeId: viajePasajeros.viajeId,
        pasajeroId: viajePasajeros.pasajeroId,
        dni: viajePasajeros.dni,
        nombres: viajePasajeros.nombres,
        apellidos: viajePasajeros.apellidos,
        asistencia: viajeTramoId
          ? sql<boolean>`CASE WHEN ${viajePasajeroMovimientos.id} IS NOT NULL THEN TRUE ELSE FALSE END`
          : viajePasajeros.asistencia,
        creadoEn: viajePasajeros.creadoEn,
        actualizadoEn: viajePasajeros.actualizadoEn,
        pasajero: {
          id: pasajeros.id,
          dni: pasajeros.dni,
          nombres: pasajeros.nombres,
          apellidos: pasajeros.apellidos,
        },
      })
      .from(viajePasajeros)
      .leftJoin(pasajeros, eq(viajePasajeros.pasajeroId, pasajeros.id));

    if (viajeTramoId) {
      query.leftJoin(
        viajePasajeroMovimientos,
        and(
          eq(viajePasajeroMovimientos.viajePasajeroId, viajePasajeros.id),
          eq(viajePasajeroMovimientos.viajeTramoId, viajeTramoId),
          eq(viajePasajeroMovimientos.tipoMovimiento, 'entrada'),
          isNull(viajePasajeroMovimientos.eliminadoEn),
        ),
      );
    }

    return await query.where(eq(viajePasajeros.viajeId, viajeId));
  }

  async findOne(id: number) {
    const results = await database
      .select({
        id: viajePasajeros.id,
        viajeId: viajePasajeros.viajeId,
        pasajeroId: viajePasajeros.pasajeroId,
        dni: viajePasajeros.dni,
        nombres: viajePasajeros.nombres,
        apellidos: viajePasajeros.apellidos,
        asistencia: viajePasajeros.asistencia,
        creadoEn: viajePasajeros.creadoEn,
        actualizadoEn: viajePasajeros.actualizadoEn,
        pasajero: {
          id: pasajeros.id,
          dni: pasajeros.dni,
          nombres: pasajeros.nombres,
          apellidos: pasajeros.apellidos,
        },
      })
      .from(viajePasajeros)
      .leftJoin(pasajeros, eq(viajePasajeros.pasajeroId, pasajeros.id))
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

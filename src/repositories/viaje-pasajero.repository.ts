import { Injectable } from '@nestjs/common';
import { eq, and, inArray } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { viajePasajeros, ViajePasajeroDTO } from '@db/tables/viaje-pasajero.table';
import { pasajeros } from '@db/tables/pasajero.table';

@Injectable()
export class ViajePasajeroRepository {
  async findByViajeId(viajeId: number) {
    return await database
      .select({
        viajeId: viajePasajeros.viajeId,
        pasajeroId: viajePasajeros.pasajeroId,
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
      .innerJoin(pasajeros, eq(viajePasajeros.pasajeroId, pasajeros.id))
      .where(eq(viajePasajeros.viajeId, viajeId));
  }

  async findOne(viajeId: number, pasajeroId: number) {
    const results = await database
      .select({
        viajeId: viajePasajeros.viajeId,
        pasajeroId: viajePasajeros.pasajeroId,
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
      .innerJoin(pasajeros, eq(viajePasajeros.pasajeroId, pasajeros.id))
      .where(and(eq(viajePasajeros.viajeId, viajeId), eq(viajePasajeros.pasajeroId, pasajeroId)))
      .limit(1);

    return results[0] || null;
  }

  async addPasajeros(data: ViajePasajeroDTO[]) {
    if (data.length === 0) return [];

    return await database
      .insert(viajePasajeros)
      .values(data)
      .onConflictDoUpdate({
        target: [viajePasajeros.viajeId, viajePasajeros.pasajeroId],
        set: {
          asistencia: require('drizzle-orm').sql`excluded.asistencia`,
          actualizadoEn: new Date(),
        },
      })
      .returning();
  }

  async removePasajeros(viajeId: number, pasajeroIds: number[]) {
    if (pasajeroIds.length === 0) return;
    return await database
      .delete(viajePasajeros)
      .where(and(eq(viajePasajeros.viajeId, viajeId), inArray(viajePasajeros.pasajeroId, pasajeroIds)))
      .returning();
  }

  async removeAllByViajeId(viajeId: number) {
    return await database.delete(viajePasajeros).where(eq(viajePasajeros.viajeId, viajeId));
  }

  async updateAsistencia(viajeId: number, pasajeroId: number, asistencia: boolean) {
    return await database
      .update(viajePasajeros)
      .set({ asistencia, actualizadoEn: new Date() })
      .where(and(eq(viajePasajeros.viajeId, viajeId), eq(viajePasajeros.pasajeroId, pasajeroId)))
      .returning();
  }
}

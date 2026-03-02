import { Injectable } from '@nestjs/common';
import { database } from '@db/connection.db';
import { eq, and, isNull, inArray } from 'drizzle-orm';
import { tallerSucursales, TallerSucursalDTO } from '@db/tables/taller-sucursal.table';
import { sucursales } from '@db/tables/sucursal.table';

@Injectable()
export class TallerSucursalRepository {
  async linkSucursalesToTaller(tallerId: number, sucursalIds: number[]) {
    // Eliminar relaciones previas
    await database.delete(tallerSucursales).where(eq(tallerSucursales.tallerId, tallerId));

    if (sucursalIds.length > 0) {
      const values = sucursalIds.map((sucursalId) => ({
        tallerId,
        sucursalId,
      }));
      await database.insert(tallerSucursales).values(values).returning();
    }
  }

  async unlinkSucursalFromTaller(tallerId: number, sucursalId: number) {
    await database.delete(tallerSucursales).where(and(eq(tallerSucursales.tallerId, tallerId), eq(tallerSucursales.sucursalId, sucursalId)));
  }

  async findSucursalesByTaller(tallerId: number) {
    const result = await database
      .select({
        id: sucursales.id,
        nombre: sucursales.nombre,
        direccion: sucursales.direccion,
        creadoEn: sucursales.creadoEn,
        actualizadoEn: sucursales.actualizadoEn,
      })
      .from(tallerSucursales)
      .innerJoin(sucursales, eq(tallerSucursales.sucursalId, sucursales.id))
      .where(and(eq(tallerSucursales.tallerId, tallerId), isNull(sucursales.eliminadoEn)));

    return result;
  }
}

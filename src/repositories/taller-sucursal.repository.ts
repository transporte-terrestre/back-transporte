import { Injectable } from '@nestjs/common';
import { database } from '@db/connection.db';
import { eq, and, isNull, inArray } from 'drizzle-orm';
import { tallerSucursales, TallerSucursalDTO } from '@db/tables/taller-sucursal.table';
import { sucursales } from '@db/tables/sucursal.table';

@Injectable()
export class TallerSucursalRepository {
  async linkSucursalesToTaller(tallerId: number, sucursales: { sucursalId: number; direccion: string }[]) {
    // Eliminar relaciones previas
    await database.delete(tallerSucursales).where(eq(tallerSucursales.tallerId, tallerId));

    if (sucursales.length > 0) {
      const values = sucursales.map((s) => ({
        tallerId,
        sucursalId: s.sucursalId,
        direccion: s.direccion,
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
        departamento: sucursales.departamento,
        provincia: sucursales.provincia,
        distrito: sucursales.distrito,
        direccion: tallerSucursales.direccion,
        creadoEn: sucursales.creadoEn,
        actualizadoEn: sucursales.actualizadoEn,
      })
      .from(tallerSucursales)
      .innerJoin(sucursales, eq(tallerSucursales.sucursalId, sucursales.id))
      .where(and(eq(tallerSucursales.tallerId, tallerId), isNull(sucursales.eliminadoEn)));

    return result;
  }
}

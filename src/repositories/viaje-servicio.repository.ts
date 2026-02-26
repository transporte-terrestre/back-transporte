import { Injectable } from '@nestjs/common';
import { eq, and, asc, isNull } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { viajeServicios, ViajeServicioDTO } from '@db/tables/viaje-servicio.table';

@Injectable()
export class ViajeServicioRepository {
  async findByViajeId(viajeId: number) {
    return await database
      .select({
        id: viajeServicios.id,
        viajeId: viajeServicios.viajeId,
        tipo: viajeServicios.tipo,
        longitud: viajeServicios.longitud,
        latitud: viajeServicios.latitud,
        nombreLugar: viajeServicios.nombreLugar,
        horaFinal: viajeServicios.horaFinal,
        kilometrajeFinal: viajeServicios.kilometrajeFinal,
        numeroPasajeros: viajeServicios.numeroPasajeros,
        rutaParadaId: viajeServicios.rutaParadaId,
        creadoEn: viajeServicios.creadoEn,
        actualizadoEn: viajeServicios.actualizadoEn,
      })
      .from(viajeServicios)
      .where(and(eq(viajeServicios.viajeId, viajeId), isNull(viajeServicios.eliminadoEn)))
      .orderBy(asc(viajeServicios.horaFinal));
  }

  async findByViajeIdWithParadas(viajeId: number) {
    // Obtener servicios (ya no hay cálculos complejos)
    const servicios = await this.findByViajeId(viajeId);
    return servicios;
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(viajeServicios)
      .where(and(eq(viajeServicios.id, id), isNull(viajeServicios.eliminadoEn)));
    return result[0];
  }

  async create(data: ViajeServicioDTO) {
    const result = await database.insert(viajeServicios).values(data).returning();
    return result[0];
  }

  async createMany(data: ViajeServicioDTO[]) {
    const result = await database.insert(viajeServicios).values(data).returning();
    return result;
  }

  async update(id: number, data: Partial<ViajeServicioDTO>) {
    const result = await database
      .update(viajeServicios)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(viajeServicios.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.update(viajeServicios).set({ eliminadoEn: new Date() }).where(eq(viajeServicios.id, id)).returning();
    return result[0];
  }

  async deleteByViajeId(viajeId: number) {
    const result = await database.update(viajeServicios).set({ eliminadoEn: new Date() }).where(eq(viajeServicios.viajeId, viajeId)).returning();
    return result;
  }
}

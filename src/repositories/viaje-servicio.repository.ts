import { Injectable } from '@nestjs/common';
import { eq, and, asc } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { viajeServicios, ViajeServicioDTO } from '@db/tables/viaje-servicio.table';

@Injectable()
export class ViajeServicioRepository {
  async findByViajeId(viajeId: number) {
    return await database
      .select({
        id: viajeServicios.id,
        viajeId: viajeServicios.viajeId,
        orden: viajeServicios.orden,
        tipo: viajeServicios.tipo,
        longitud: viajeServicios.longitud,
        latitud: viajeServicios.latitud,
        nombreLugar: viajeServicios.nombreLugar,
        horaFinal: viajeServicios.horaFinal,
        kilometrajeFinal: viajeServicios.kilometrajeFinal,
        numeroPasajeros: viajeServicios.numeroPasajeros,
        observaciones: viajeServicios.observaciones,
        creadoEn: viajeServicios.creadoEn,
        actualizadoEn: viajeServicios.actualizadoEn,
      })
      .from(viajeServicios)
      .where(eq(viajeServicios.viajeId, viajeId))
      .orderBy(asc(viajeServicios.orden));
  }

  async findByViajeIdWithParadas(viajeId: number) {
    // Obtener servicios (ya no hay cálculos complejos)
    const servicios = await this.findByViajeId(viajeId);
    return servicios;
  }

  async findOne(id: number) {
    const result = await database.select().from(viajeServicios).where(eq(viajeServicios.id, id));
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
    const result = await database.delete(viajeServicios).where(eq(viajeServicios.id, id)).returning();
    return result[0];
  }

  async deleteByViajeId(viajeId: number) {
    const result = await database.delete(viajeServicios).where(eq(viajeServicios.viajeId, viajeId)).returning();
    return result;
  }

  async getMaxOrden(viajeId: number): Promise<number> {
    const result = await database
      .select({ orden: viajeServicios.orden })
      .from(viajeServicios)
      .where(eq(viajeServicios.viajeId, viajeId))
      .orderBy(asc(viajeServicios.orden));

    if (result.length === 0) return 0;
    return Math.max(...result.map((r) => r.orden));
  }

  async reordenar(viajeId: number, serviciosOrdenados: { id: number; orden: number }[]) {
    const resultados = [];
    for (const servicio of serviciosOrdenados) {
      const result = await database
        .update(viajeServicios)
        .set({ orden: servicio.orden, actualizadoEn: new Date() })
        .where(and(eq(viajeServicios.id, servicio.id), eq(viajeServicios.viajeId, viajeId)))
        .returning();
      resultados.push(result[0]);
    }
    return resultados;
  }
}

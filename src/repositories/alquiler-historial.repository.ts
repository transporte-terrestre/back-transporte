import { Injectable } from '@nestjs/common';
import { eq, and, isNull, desc } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { alquilerHistorial, AlquilerHistorialDTO } from '@db/tables/alquiler-historial.table';
import { vehiculos } from '@db/tables/vehiculo.table';

@Injectable()
export class AlquilerHistorialRepository {
  async findByAlquilerId(alquilerId: number) {
    return await database
      .select({
        id: alquilerHistorial.id,
        alquilerId: alquilerHistorial.alquilerId,
        vehiculoId: alquilerHistorial.vehiculoId,
        tipoAccion: alquilerHistorial.tipoAccion,
        montoAnterior: alquilerHistorial.montoAnterior,
        montoNuevo: alquilerHistorial.montoNuevo,
        motivo: alquilerHistorial.motivo,
        fechaAccion: alquilerHistorial.fechaAccion,
        vehiculo: {
          id: vehiculos.id,
          placa: vehiculos.placa,
        },
      })
      .from(alquilerHistorial)
      .leftJoin(vehiculos, eq(alquilerHistorial.vehiculoId, vehiculos.id))
      .where(and(eq(alquilerHistorial.alquilerId, alquilerId), isNull(alquilerHistorial.eliminadoEn)))
      .orderBy(desc(alquilerHistorial.fechaAccion));
  }

  async create(data: AlquilerHistorialDTO) {
    const [record] = await database.insert(alquilerHistorial).values(data).returning();
    return record;
  }
}

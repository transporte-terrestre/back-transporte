import { Injectable } from '@nestjs/common';
import { eq, and, isNull, inArray, sql } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { alquilerDetalle, AlquilerDetalleDTO } from '@db/tables/alquiler-detalle.table';
import { vehiculos } from '@db/tables/vehiculo.table';
import { conductores } from '@db/tables/conductor.table';
import { marcas } from '@db/tables/marca.table';
import { modelos } from '@db/tables/modelo.table';

@Injectable()
export class AlquilerDetalleRepository {
  async findByAlquilerId(alquilerId: number) {
    return await database
      .select({
        id: alquilerDetalle.id,
        alquilerId: alquilerDetalle.alquilerId,
        vehiculoId: alquilerDetalle.vehiculoId,
        conductorId: alquilerDetalle.conductorId,
        tipo: alquilerDetalle.tipo,
        kilometrajeInicial: alquilerDetalle.kilometrajeInicial,
        kilometrajeFinal: alquilerDetalle.kilometrajeFinal,
        creadoEn: alquilerDetalle.creadoEn,
        vehiculo: {
          id: vehiculos.id,
          placa: vehiculos.placa,
          marca: marcas.nombre,
          modelo: modelos.nombre,
          foto: sql<string | null>`${vehiculos.imagenes}[1]`,
        },
        conductor: {
          id: conductores.id,
          nombreCompleto: conductores.nombreCompleto,
          dni: conductores.dni,
        },
      })
      .from(alquilerDetalle)
      .leftJoin(vehiculos, eq(alquilerDetalle.vehiculoId, vehiculos.id))
      .leftJoin(conductores, eq(alquilerDetalle.conductorId, conductores.id))
      .leftJoin(modelos, eq(vehiculos.modeloId, modelos.id))
      .leftJoin(marcas, eq(modelos.marcaId, marcas.id))
      .where(and(eq(alquilerDetalle.alquilerId, alquilerId), isNull(alquilerDetalle.eliminadoEn)));
  }

  async findByAlquilerIds(alquilerIds: number[]) {
    if (alquilerIds.length === 0) return [];

    return await database
      .select({
        id: alquilerDetalle.id,
        alquilerId: alquilerDetalle.alquilerId,
        vehiculoId: alquilerDetalle.vehiculoId,
        conductorId: alquilerDetalle.conductorId,
        tipo: alquilerDetalle.tipo,
        kilometrajeInicial: alquilerDetalle.kilometrajeInicial,
        kilometrajeFinal: alquilerDetalle.kilometrajeFinal,
        creadoEn: alquilerDetalle.creadoEn,
        vehiculo: {
          id: vehiculos.id,
          placa: vehiculos.placa,
          marca: marcas.nombre,
          modelo: modelos.nombre,
          foto: sql<string | null>`${vehiculos.imagenes}[1]`,
        },
        conductor: {
          id: conductores.id,
          nombreCompleto: conductores.nombreCompleto,
          dni: conductores.dni,
        },
      })
      .from(alquilerDetalle)
      .leftJoin(vehiculos, eq(alquilerDetalle.vehiculoId, vehiculos.id))
      .leftJoin(conductores, eq(alquilerDetalle.conductorId, conductores.id))
      .leftJoin(modelos, eq(vehiculos.modeloId, modelos.id))
      .leftJoin(marcas, eq(modelos.marcaId, marcas.id))
      .where(and(inArray(alquilerDetalle.alquilerId, alquilerIds), isNull(alquilerDetalle.eliminadoEn)));
  }

  async create(data: AlquilerDetalleDTO) {
    const [record] = await database.insert(alquilerDetalle).values(data).returning();
    return record;
  }

  async update(id: number, data: Partial<AlquilerDetalleDTO>) {
    const [record] = await database
      .update(alquilerDetalle)
      .set({ ...data, actualizadoEn: new Date() })
      .where(and(eq(alquilerDetalle.id, id), isNull(alquilerDetalle.eliminadoEn)))
      .returning();
    return record;
  }

  async delete(id: number) {
    const [record] = await database
      .update(alquilerDetalle)
      .set({
        eliminadoEn: new Date(),
        actualizadoEn: new Date(),
      })
      .where(and(eq(alquilerDetalle.id, id), isNull(alquilerDetalle.eliminadoEn)))
      .returning();
    return record;
  }

  async findActiveByVehiculo(vehiculoId: number): Promise<any[]> {
    return await database
      .select()
      .from(alquilerDetalle)
      .where(and(eq(alquilerDetalle.vehiculoId, vehiculoId), isNull(alquilerDetalle.eliminadoEn)));
  }

  async findOne(id: number): Promise<any> {
    const [record] = await database
      .select({
        id: alquilerDetalle.id,
        alquilerId: alquilerDetalle.alquilerId,
        vehiculoId: alquilerDetalle.vehiculoId,
        conductorId: alquilerDetalle.conductorId,
        tipo: alquilerDetalle.tipo,
        kilometrajeInicial: alquilerDetalle.kilometrajeInicial,
        kilometrajeFinal: alquilerDetalle.kilometrajeFinal,
        creadoEn: alquilerDetalle.creadoEn,
        vehiculo: {
          id: vehiculos.id,
          placa: vehiculos.placa,
        },
      })
      .from(alquilerDetalle)
      .leftJoin(vehiculos, eq(alquilerDetalle.vehiculoId, vehiculos.id))
      .where(and(eq(alquilerDetalle.id, id), isNull(alquilerDetalle.eliminadoEn)));
    return record;
  }
}

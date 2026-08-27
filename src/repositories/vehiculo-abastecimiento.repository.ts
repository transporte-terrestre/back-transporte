import { Injectable } from '@nestjs/common';
import { eq, and, isNull, desc, count, ilike, or, SQL } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { vehiculoAbastecimientos, VehiculoAbastecimientoDTO } from '@db/tables/vehiculo-abastecimiento.table';
import { vehiculos } from '@db/tables/vehiculo.table';
import { viajeTramos } from '@db/tables/viaje-tramo.table';

interface AbastecimientoFilters {
  search?: string;
  vehiculoId?: number;
  viajeTramoId?: number;
}

@Injectable()
export class VehiculoAbastecimientoRepository {
  private selectFields = {
    id: vehiculoAbastecimientos.id,
    vehiculoId: vehiculoAbastecimientos.vehiculoId,
    viajeTramoId: vehiculoAbastecimientos.viajeTramoId,
    viajeId: viajeTramos.viajeId,
    kilometrajeSuelto: vehiculoAbastecimientos.kilometrajeSuelto,
    tramoSuelto: vehiculoAbastecimientos.tramoSuelto,
    fechaAbastecimiento: vehiculoAbastecimientos.fechaAbastecimiento,
    metadata: vehiculoAbastecimientos.metadata,
    combustible: vehiculoAbastecimientos.combustible,
    galonesEstablecidos: vehiculoAbastecimientos.galonesEstablecidos,
    creadoEn: vehiculoAbastecimientos.creadoEn,
    actualizadoEn: vehiculoAbastecimientos.actualizadoEn,
    vehiculoPlaca: vehiculos.placa,
    vehiculoCodigoInterno: vehiculos.codigoInterno,
    vehiculoImagenes: vehiculos.imagenes,
    tramoNombreLugar: viajeTramos.nombreLugar,
    tramoHoraFinal: viajeTramos.horaFinal,
    tramoKilometrajeFinal: viajeTramos.kilometrajeFinal,
    tramoLatitud: viajeTramos.latitud,
    tramoLongitud: viajeTramos.longitud,
  };

  async findAllPaginated(page: number = 1, limit: number = 10, filters?: AbastecimientoFilters) {
    const offset = (page - 1) * limit;
    const conditions: SQL[] = [isNull(vehiculoAbastecimientos.eliminadoEn)];

    if (filters?.vehiculoId) {
      conditions.push(eq(vehiculoAbastecimientos.vehiculoId, filters.vehiculoId));
    }

    if (filters?.viajeTramoId) {
      conditions.push(eq(vehiculoAbastecimientos.viajeTramoId, filters.viajeTramoId));
    }

    if (filters?.search) {
      const searchTerm = filters.search.trim();
      const searchCondition = or(
        ilike(vehiculos.placa, `%${searchTerm}%`),
        ilike(vehiculos.codigoInterno, `%${searchTerm}%`),
        ilike(viajeTramos.nombreLugar, `%${searchTerm}%`),
        ilike(vehiculoAbastecimientos.tramoSuelto, `%${searchTerm}%`),
      );

      if (searchCondition) conditions.push(searchCondition);
    }

    const whereClause = and(...conditions);

    const [{ total }] = await database
      .select({ total: count() })
      .from(vehiculoAbastecimientos)
      .innerJoin(vehiculos, eq(vehiculoAbastecimientos.vehiculoId, vehiculos.id))
      .leftJoin(viajeTramos, eq(vehiculoAbastecimientos.viajeTramoId, viajeTramos.id))
      .where(whereClause);

    const data = await database
      .select(this.selectFields)
      .from(vehiculoAbastecimientos)
      .innerJoin(vehiculos, eq(vehiculoAbastecimientos.vehiculoId, vehiculos.id))
      .leftJoin(viajeTramos, eq(vehiculoAbastecimientos.viajeTramoId, viajeTramos.id))
      .where(whereClause)
      .orderBy(desc(vehiculoAbastecimientos.creadoEn))
      .limit(limit)
      .offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database
      .select(this.selectFields)
      .from(vehiculoAbastecimientos)
      .innerJoin(vehiculos, eq(vehiculoAbastecimientos.vehiculoId, vehiculos.id))
      .leftJoin(viajeTramos, eq(vehiculoAbastecimientos.viajeTramoId, viajeTramos.id))
      .where(and(eq(vehiculoAbastecimientos.id, id), isNull(vehiculoAbastecimientos.eliminadoEn)));
    return result[0];
  }

  async create(data: VehiculoAbastecimientoDTO) {
    const [newItem] = await database.insert(vehiculoAbastecimientos).values(data).returning();
    return newItem;
  }

  async findByViajeTramo(viajeTramoId: number) {
    return await database
      .select(this.selectFields)
      .from(vehiculoAbastecimientos)
      .innerJoin(vehiculos, eq(vehiculoAbastecimientos.vehiculoId, vehiculos.id))
      .leftJoin(viajeTramos, eq(vehiculoAbastecimientos.viajeTramoId, viajeTramos.id))
      .where(and(eq(vehiculoAbastecimientos.viajeTramoId, viajeTramoId), isNull(vehiculoAbastecimientos.eliminadoEn)));
  }

  async findByVehiculoId(vehiculoId: number) {
    return await database
      .select(this.selectFields)
      .from(vehiculoAbastecimientos)
      .innerJoin(vehiculos, eq(vehiculoAbastecimientos.vehiculoId, vehiculos.id))
      .leftJoin(viajeTramos, eq(vehiculoAbastecimientos.viajeTramoId, viajeTramos.id))
      .where(and(eq(vehiculoAbastecimientos.vehiculoId, vehiculoId), isNull(vehiculoAbastecimientos.eliminadoEn)))
      .orderBy(desc(vehiculoAbastecimientos.creadoEn));
  }

  async update(id: number, data: Partial<VehiculoAbastecimientoDTO>) {
    const [updatedItem] = await database
      .update(vehiculoAbastecimientos)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(vehiculoAbastecimientos.id, id))
      .returning();
    return updatedItem;
  }

  async delete(id: number) {
    const [deletedItem] = await database
      .update(vehiculoAbastecimientos)
      .set({ eliminadoEn: new Date() })
      .where(eq(vehiculoAbastecimientos.id, id))
      .returning();
    return deletedItem;
  }

  async deleteByViajeTramo(viajeTramoId: number) {
    const deletedItems = await database
      .update(vehiculoAbastecimientos)
      .set({ eliminadoEn: new Date() })
      .where(and(eq(vehiculoAbastecimientos.viajeTramoId, viajeTramoId), isNull(vehiculoAbastecimientos.eliminadoEn)))
      .returning();
    return deletedItems;
  }
}

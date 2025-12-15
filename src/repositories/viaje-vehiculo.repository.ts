import { Injectable } from "@nestjs/common";
import { eq, and, count } from "drizzle-orm";
import { database } from "@db/connection.db";
import { viajeVehiculos, ViajeVehiculoDTO } from "@model/tables/viaje-vehiculo.model";

@Injectable()
export class ViajeVehiculoRepository {
  async findAll() {
    return await database.select().from(viajeVehiculos);
  }

  async findAllPaginated(page: number = 1, limit: number = 10, filters?: { viajeId?: number; vehiculoId?: number }) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.viajeId) {
      conditions.push(eq(viajeVehiculos.viajeId, filters.viajeId));
    }

    if (filters?.vehiculoId) {
      conditions.push(eq(viajeVehiculos.vehiculoId, filters.vehiculoId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database
      .select({ total: count() })
      .from(viajeVehiculos)
      .where(whereClause);

    const data = await database
      .select()
      .from(viajeVehiculos)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    return { data, total: Number(total) };
  }

  async findOne(viajeId: number, vehiculoId: number) {
    const result = await database
      .select()
      .from(viajeVehiculos)
      .where(and(eq(viajeVehiculos.viajeId, viajeId), eq(viajeVehiculos.vehiculoId, vehiculoId)));
    return result[0];
  }

  async findByViajeId(viajeId: number) {
    return await database.select().from(viajeVehiculos).where(eq(viajeVehiculos.viajeId, viajeId));
  }

  async findByVehiculoId(vehiculoId: number) {
    return await database.select().from(viajeVehiculos).where(eq(viajeVehiculos.vehiculoId, vehiculoId));
  }

  async create(data: ViajeVehiculoDTO) {
    const result = await database.insert(viajeVehiculos).values(data).returning();
    return result[0];
  }

  async update(viajeId: number, vehiculoId: number, data: Partial<ViajeVehiculoDTO>) {
    const result = await database
      .update(viajeVehiculos)
      .set({ ...data, actualizadoEn: new Date() })
      .where(and(eq(viajeVehiculos.viajeId, viajeId), eq(viajeVehiculos.vehiculoId, vehiculoId)))
      .returning();
    return result[0];
  }

  async delete(viajeId: number, vehiculoId: number) {
    const result = await database
      .delete(viajeVehiculos)
      .where(and(eq(viajeVehiculos.viajeId, viajeId), eq(viajeVehiculos.vehiculoId, vehiculoId)))
      .returning();
    return result[0];
  }
}

import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { database } from "@db/connection.db";
import {
  vehiculosConductores,
  VehiculoConductorDTO,
} from "@model/tables/vehiculo-conductor.model";

@Injectable()
export class VehiculoConductorRepository {
  async findAll() {
    return await database.select().from(vehiculosConductores);
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(vehiculosConductores)
      .where(eq(vehiculosConductores.id, id));
    return result[0];
  }

  async create(data: VehiculoConductorDTO) {
    const result = await database
      .insert(vehiculosConductores)
      .values(data)
      .returning();
    return result[0];
  }

  async update(id: number, data: Partial<VehiculoConductorDTO>) {
    // Note: vehiculosConductores might not have actualizadoEn in the original schema but added it for consistency in model
    const result = await database
      .update(vehiculosConductores)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(vehiculosConductores.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database
      .delete(vehiculosConductores)
      .where(eq(vehiculosConductores.id, id))
      .returning();
    return result[0];
  }
}

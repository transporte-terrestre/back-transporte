import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { database } from "@db/connection.db";
import { viajes, ViajeDTO } from "@model/tables/viaje.model";

@Injectable()
export class ViajeRepository {
  async findAll() {
    return await database.select().from(viajes);
  }

  async findOne(id: number) {
    const result = await database.select().from(viajes).where(eq(viajes.id, id));
    return result[0];
  }

  async create(data: ViajeDTO) {
    const result = await database.insert(viajes).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<ViajeDTO>) {
    const result = await database
      .update(viajes)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(viajes.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database
      .delete(viajes)
      .where(eq(viajes.id, id))
      .returning();
    return result[0];
  }
}

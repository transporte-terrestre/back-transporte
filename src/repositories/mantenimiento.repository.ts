import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { database } from "@db/connection.db";
import { mantenimientos, MantenimientoDTO } from "@model/tables/mantenimiento.model";

@Injectable()
export class MantenimientoRepository {
  async findAll() {
    return await database.select().from(mantenimientos);
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(mantenimientos)
      .where(eq(mantenimientos.id, id));
    return result[0];
  }

  async create(data: MantenimientoDTO) {
    const result = await database.insert(mantenimientos).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<MantenimientoDTO>) {
    const result = await database
      .update(mantenimientos)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(mantenimientos.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database
      .delete(mantenimientos)
      .where(eq(mantenimientos.id, id))
      .returning();
    return result[0];
  }
}

import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { database } from "@db/connection.db";
import { rutas, RutaDTO } from "@models/tables/ruta.model";

@Injectable()
export class RutaRepository {
  async findAll() {
    return await database.select().from(rutas);
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(rutas)
      .where(eq(rutas.id, id));
    return result[0];
  }

  async create(data: RutaDTO) {
    const result = await database.insert(rutas).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<RutaDTO>) {
    const result = await database
      .update(rutas)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(rutas.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database
      .delete(rutas)
      .where(eq(rutas.id, id))
      .returning();
    return result[0];
  }
}

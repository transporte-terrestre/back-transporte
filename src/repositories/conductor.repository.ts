import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { database } from "@db/connection.db";
import { conductores, ConductorDTO } from "@models/tables/conductor.model";

@Injectable()
export class ConductorRepository {
  async findAll() {
    return await database.select().from(conductores);
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(conductores)
      .where(eq(conductores.id, id));
    return result[0];
  }

  async create(data: ConductorDTO) {
    const result = await database.insert(conductores).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<ConductorDTO>) {
    const result = await database
      .update(conductores)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(conductores.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database
      .delete(conductores)
      .where(eq(conductores.id, id))
      .returning();
    return result[0];
  }
}

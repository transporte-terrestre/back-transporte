import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { database } from "@db/connection.db";
import { vehiculos, VehiculoDTO } from "@model/tables/vehiculo.model";

@Injectable()
export class VehiculoRepository {
  async findAll() {
    return await database.select().from(vehiculos);
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(vehiculos)
      .where(eq(vehiculos.id, id));
    return result[0];
  }

  async create(data: VehiculoDTO) {
    const result = await database.insert(vehiculos).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<VehiculoDTO>) {
    const result = await database
      .update(vehiculos)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(vehiculos.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database
      .delete(vehiculos)
      .where(eq(vehiculos.id, id))
      .returning();
    return result[0];
  }
}

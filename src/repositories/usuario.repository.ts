import { Injectable } from "@nestjs/common";
import { database } from "@db/connection.db";
import { usuarios, Usuario, UsuarioDTO } from "@models/tables/usuario.model";
import { eq } from "drizzle-orm";

@Injectable()
export class UsuarioRepository {
  async findAll() {
    return await database.select().from(usuarios);
  }

  async findOne(id: number) {
    const result = await database.select().from(usuarios).where(eq(usuarios.id, id));
    return result[0];
  }

  async findByEmail(email: string) {
    const result = await database
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, email));
    return result[0];
  }

  async create(data: UsuarioDTO) {
    const result = await database.insert(usuarios).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<UsuarioDTO>) {
    const result = await database
      .update(usuarios)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(usuarios.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database
      .delete(usuarios)
      .where(eq(usuarios.id, id))
      .returning();
    return result[0];
  }
}

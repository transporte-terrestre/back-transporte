import { Injectable } from "@nestjs/common";
import { database } from "@db/connection.db";
import { clientes, Cliente, ClienteDTO } from "@model/tables/cliente.model";
import { eq } from "drizzle-orm";

@Injectable()
export class ClienteRepository {
  async findAll() {
    return await database.select().from(clientes);
  }

  async findOne(id: number) {
    const result = await database.select().from(clientes).where(eq(clientes.id, id));
    return result[0];
  }

  async findByDni(dni: string) {
    const result = await database
      .select()
      .from(clientes)
      .where(eq(clientes.dni, dni));
    return result[0];
  }

  async findByEmail(email: string) {
    const result = await database
      .select()
      .from(clientes)
      .where(eq(clientes.email, email));
    return result[0];
  }

  async create(data: ClienteDTO) {
    const result = await database.insert(clientes).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<ClienteDTO>) {
    const result = await database
      .update(clientes)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(clientes.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database
      .delete(clientes)
      .where(eq(clientes.id, id))
      .returning();
    return result[0];
  }
}

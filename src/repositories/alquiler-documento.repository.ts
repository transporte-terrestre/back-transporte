import { Injectable } from '@nestjs/common';
import { database } from '@db/connection.db';
import { alquilerDocumentos, AlquilerDocumentoDTO } from '@db/tables/alquiler-documento.table';
import { eq } from 'drizzle-orm';

@Injectable()
export class AlquilerDocumentoRepository {
  async findOne(id: number) {
    const [result] = await database.select().from(alquilerDocumentos).where(eq(alquilerDocumentos.id, id));
    return result;
  }

  async findByAlquilerId(alquilerId: number) {
    return await database.select().from(alquilerDocumentos).where(eq(alquilerDocumentos.alquilerId, alquilerId));
  }

  async create(data: AlquilerDocumentoDTO) {
    const [result] = await database.insert(alquilerDocumentos).values(data).returning();
    return result;
  }

  async update(id: number, data: Partial<AlquilerDocumentoDTO>) {
    const [result] = await database
      .update(alquilerDocumentos)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(alquilerDocumentos.id, id))
      .returning();
    return result;
  }

  async delete(id: number) {
    const [result] = await database.delete(alquilerDocumentos).where(eq(alquilerDocumentos.id, id)).returning();
    return result;
  }
}

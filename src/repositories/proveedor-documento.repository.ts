import { Injectable } from '@nestjs/common';
import { database } from '@db/connection.db';
import { proveedorDocumentos, ProveedorDocumento, ProveedorDocumentoDTO } from '@model/tables/proveedor-documento.model';
import { eq, and, isNull } from 'drizzle-orm';

@Injectable()
export class ProveedorDocumentoRepository {
  async findByProveedorId(proveedorId: number) {
    return await database
      .select()
      .from(proveedorDocumentos)
      .where(and(eq(proveedorDocumentos.proveedorId, proveedorId), isNull(proveedorDocumentos.eliminadoEn)));
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(proveedorDocumentos)
      .where(and(eq(proveedorDocumentos.id, id), isNull(proveedorDocumentos.eliminadoEn)));
    return result[0];
  }

  async create(data: ProveedorDocumentoDTO) {
    const result = await database.insert(proveedorDocumentos).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<ProveedorDocumentoDTO>) {
    const result = await database
      .update(proveedorDocumentos)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(proveedorDocumentos.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database
      .update(proveedorDocumentos)
      .set({ eliminadoEn: new Date() })
      .where(eq(proveedorDocumentos.id, id))
      .returning();
    return result[0];
  }
}

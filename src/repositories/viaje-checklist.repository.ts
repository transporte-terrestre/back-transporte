import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { viajeChecklists, ViajeChecklistDTO } from '@db/tables/viaje-checklist.table';
import { viajeChecklistItems, ViajeChecklistItemDTO } from '@db/tables/viaje-checklist-item.table';
import { checklistItems } from '@db/tables/checklist-item.table';

@Injectable()
export class ViajeChecklistRepository {
  async findByViajeId(viajeId: number) {
    return await database.select().from(viajeChecklists).where(eq(viajeChecklists.viajeId, viajeId));
  }

  async findByViajeIdAndTipo(viajeId: number, tipo: 'salida' | 'entrada') {
    const result = await database
      .select()
      .from(viajeChecklists)
      .where(and(eq(viajeChecklists.viajeId, viajeId), eq(viajeChecklists.tipo, tipo)));
    return result[0];
  }

  async findOne(id: number) {
    const result = await database.select().from(viajeChecklists).where(eq(viajeChecklists.id, id));
    return result[0];
  }

  async findOneWithItems(id: number) {
    const checklist = await this.findOne(id);
    if (!checklist) return null;

    const items = await database
      .select({
        id: viajeChecklistItems.id,
        viajeChecklistId: viajeChecklistItems.viajeChecklistId,
        checklistItemId: viajeChecklistItems.checklistItemId,
        completado: viajeChecklistItems.completado,
        observacion: viajeChecklistItems.observacion,
        creadoEn: viajeChecklistItems.creadoEn,
        actualizadoEn: viajeChecklistItems.actualizadoEn,
        // Datos del item
        seccion: checklistItems.seccion,
        nombre: checklistItems.nombre,
        descripcion: checklistItems.descripcion,
        icono: checklistItems.icono,
        orden: checklistItems.orden,
      })
      .from(viajeChecklistItems)
      .innerJoin(checklistItems, eq(viajeChecklistItems.checklistItemId, checklistItems.id))
      .where(eq(viajeChecklistItems.viajeChecklistId, id))
      .orderBy(checklistItems.seccion, checklistItems.orden);

    return { ...checklist, items };
  }

  async create(data: ViajeChecklistDTO) {
    const result = await database.insert(viajeChecklists).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<ViajeChecklistDTO>) {
    const result = await database
      .update(viajeChecklists)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(viajeChecklists.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.delete(viajeChecklists).where(eq(viajeChecklists.id, id)).returning();
    return result[0];
  }

  // ========== ITEMS ==========
  async createItem(data: ViajeChecklistItemDTO) {
    const result = await database.insert(viajeChecklistItems).values(data).returning();
    return result[0];
  }

  async createManyItems(data: ViajeChecklistItemDTO[]) {
    const result = await database.insert(viajeChecklistItems).values(data).returning();
    return result;
  }

  async updateItem(id: number, data: Partial<ViajeChecklistItemDTO>) {
    const result = await database
      .update(viajeChecklistItems)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(viajeChecklistItems.id, id))
      .returning();
    return result[0];
  }

  async findItem(id: number) {
    const result = await database.select().from(viajeChecklistItems).where(eq(viajeChecklistItems.id, id));
    return result[0];
  }
}

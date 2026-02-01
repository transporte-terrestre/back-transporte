import { Injectable } from '@nestjs/common';
import { eq, and, sql } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { viajeChecklists, ViajeChecklistDTO } from '@db/tables/viaje-checklist.table';
import { viajeChecklistItems, ViajeChecklistItemDTO } from '@db/tables/viaje-checklist-item.table';
import { checklistItems } from '@db/tables/checklist-item.table';

interface ItemUpsertData {
  checklistItemId: number;
  completado: boolean;
  observacion?: string;
}

@Injectable()
export class ViajeChecklistRepository {
  async findByViajeId(viajeId: number) {
    return await database.select().from(viajeChecklists).where(eq(viajeChecklists.viajeId, viajeId));
  }

  async findByViajeIdAndTipo(viajeId: number, tipo: 'salida' | 'llegada') {
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
        viajeChecklistId: viajeChecklistItems.viajeChecklistId,
        checklistItemId: viajeChecklistItems.checklistItemId,
        completado: viajeChecklistItems.completado,
        observacion: viajeChecklistItems.observacion,
        creadoEn: viajeChecklistItems.creadoEn,
        actualizadoEn: viajeChecklistItems.actualizadoEn,
        // Datos del item del catálogo
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

  async findOneWithItemsByViajeIdAndTipo(viajeId: number, tipo: 'salida' | 'llegada') {
    const checklist = await this.findByViajeIdAndTipo(viajeId, tipo);
    if (!checklist) return null;
    return this.findOneWithItems(checklist.id);
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
    if (data.length === 0) return [];
    const result = await database.insert(viajeChecklistItems).values(data).returning();
    return result;
  }

  async updateItem(viajeChecklistId: number, checklistItemId: number, data: Partial<ViajeChecklistItemDTO>) {
    const result = await database
      .update(viajeChecklistItems)
      .set({ ...data, actualizadoEn: new Date() })
      .where(and(eq(viajeChecklistItems.viajeChecklistId, viajeChecklistId), eq(viajeChecklistItems.checklistItemId, checklistItemId)))
      .returning();
    return result[0];
  }

  async findItem(viajeChecklistId: number, checklistItemId: number) {
    const result = await database
      .select()
      .from(viajeChecklistItems)
      .where(and(eq(viajeChecklistItems.viajeChecklistId, viajeChecklistId), eq(viajeChecklistItems.checklistItemId, checklistItemId)));
    return result[0];
  }

  async deleteItemsByChecklistId(checklistId: number) {
    await database.delete(viajeChecklistItems).where(eq(viajeChecklistItems.viajeChecklistId, checklistId));
  }

  /**
   * Upsert de items para un checklist específico.
   * Usa ON CONFLICT para actualizar si ya existe o insertar si no.
   */
  async upsertItems(checklistId: number, items: ItemUpsertData[]) {
    if (items.length === 0) return [];

    const results = [];

    for (const item of items) {
      const result = await database
        .insert(viajeChecklistItems)
        .values({
          viajeChecklistId: checklistId,
          checklistItemId: item.checklistItemId,
          completado: item.completado,
          observacion: item.observacion || null,
        })
        .onConflictDoUpdate({
          target: [viajeChecklistItems.viajeChecklistId, viajeChecklistItems.checklistItemId],
          set: {
            completado: item.completado,
            observacion: item.observacion || null,
            actualizadoEn: new Date(),
          },
        })
        .returning();

      results.push(result[0]);
    }

    return results;
  }
}

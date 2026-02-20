import { Injectable } from '@nestjs/common';
import { eq, and, sql } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { viajeChecklists, ViajeChecklistDTO } from '@db/tables/viaje-checklist.table';
import { viajeChecklistItems, ViajeChecklistItemDTO } from '@db/tables/viaje-checklist-item.table';
import { checklistItems } from '@db/tables/checklist-item.table';
import { ViajeChecklistItem } from '@db/tables/viaje-checklist-item.table';
import { vehiculoChecklistDocuments } from '@db/tables/vehiculo-checklist-document.table';

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

    const items = await this.fetchItems(id);
    return { ...checklist, items };
  }

  async findOneWithItemsByViajeIdAndTipo(viajeId: number, tipo: 'salida' | 'llegada') {
    const checklist = await this.findByViajeIdAndTipo(viajeId, tipo);
    if (!checklist) return null;

    const items = await this.fetchItems(checklist.id);
    return { ...checklist, items };
  }

  private async fetchItems(checklistId: number) {
    return await database
      .select({
        viajeChecklistId: viajeChecklistItems.viajeChecklistId,
        checklistItemId: viajeChecklistItems.checklistItemId,
        vehiculoChecklistDocumentId: viajeChecklistItems.vehiculoChecklistDocumentId,
        observacion: viajeChecklistItems.observacion,
        creadoEn: viajeChecklistItems.creadoEn,
        actualizadoEn: viajeChecklistItems.actualizadoEn,
        nombre: checklistItems.nombre,
        descripcion: checklistItems.descripcion,
        orden: checklistItems.orden,
      })
      .from(viajeChecklistItems)
      .innerJoin(checklistItems, eq(viajeChecklistItems.checklistItemId, checklistItems.id))
      .where(eq(viajeChecklistItems.viajeChecklistId, checklistId))
      .orderBy(checklistItems.orden);
  }

  async create(data: ViajeChecklistDTO) {
    const result = await database
      .insert(viajeChecklists)
      .values(data)
      .onConflictDoUpdate({
        target: [viajeChecklists.viajeId, viajeChecklists.tipo],
        set: {
          ...(data.validadoPor !== undefined ? { validadoPor: data.validadoPor } : {}),
          ...(data.validadoEn !== undefined ? { validadoEn: data.validadoEn } : {}),
          ...(data.observaciones !== undefined ? { observaciones: data.observaciones } : {}),
          actualizadoEn: new Date(),
        },
      })
      .returning();
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

  // ========== ITEMS (Ejecuciones de Checklists) ==========

  async deleteItemsByChecklistId(checklistId: number) {
    await database.delete(viajeChecklistItems).where(eq(viajeChecklistItems.viajeChecklistId, checklistId));
  }

  async upsertItems(
    checklistId: number,
    items: {
      checklistItemId: number;
      vehiculoChecklistDocumentId: number | null;
      observacion?: string | null;
    }[],
  ): Promise<ViajeChecklistItem[]> {
    if (items.length === 0) return [];

    const results: ViajeChecklistItem[] = [];

    for (const item of items) {
      const result = await database
        .insert(viajeChecklistItems)
        .values({
          viajeChecklistId: checklistId,
          checklistItemId: item.checklistItemId,
          vehiculoChecklistDocumentId: item.vehiculoChecklistDocumentId,
          observacion: item.observacion || null,
        })
        .onConflictDoUpdate({
          target: [viajeChecklistItems.viajeChecklistId, viajeChecklistItems.checklistItemId],
          set: {
            vehiculoChecklistDocumentId: item.vehiculoChecklistDocumentId,
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

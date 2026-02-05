import { Injectable } from '@nestjs/common';
import { eq, and, desc, sql } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { vehiculoChecklistDocuments, VehiculoChecklistDocumentDTO } from '@db/tables/vehiculo-checklist-document.table';
import { vehiculoChecklistDocumentItems, VehiculoChecklistDocumentItemDTO } from '@db/tables/vehiculo-checklist-document-item.table';

@Injectable()
export class VehiculoChecklistDocumentRepository {
  // Encontrar la versión ACTIVA de un documento para un vehículo y tipo específico
  async findActive(vehiculoId: number, checklistItemId: number) {
    const result = await database
      .select()
      .from(vehiculoChecklistDocuments)
      .where(
        and(
          eq(vehiculoChecklistDocuments.vehiculoId, vehiculoId),
          eq(vehiculoChecklistDocuments.checklistItemId, checklistItemId),
          eq(vehiculoChecklistDocuments.activo, true),
          sql`${vehiculoChecklistDocuments.eliminadoEn} IS NULL`,
        ),
      );
    return result[0];
  }

  // Encontrar TODOS los documentos activos de un vehículo (para construir template)
  async findAllActiveByVehiculoId(vehiculoId: number) {
    return await database
      .select()
      .from(vehiculoChecklistDocuments)
      .where(
        and(
          eq(vehiculoChecklistDocuments.vehiculoId, vehiculoId),
          eq(vehiculoChecklistDocuments.activo, true),
          sql`${vehiculoChecklistDocuments.eliminadoEn} IS NULL`,
        ),
      );
  }

  // Encontrar una versión específica por su código/versión
  async findByVersion(vehiculoId: number, checklistItemId: number, version: string) {
    const result = await database
      .select()
      .from(vehiculoChecklistDocuments)
      .where(
        and(
          eq(vehiculoChecklistDocuments.vehiculoId, vehiculoId),
          eq(vehiculoChecklistDocuments.checklistItemId, checklistItemId),
          eq(vehiculoChecklistDocuments.version, version),
          sql`${vehiculoChecklistDocuments.eliminadoEn} IS NULL`,
        ),
      );
    return result[0];
  }

  async create(data: VehiculoChecklistDocumentDTO) {
    const result = await database.insert(vehiculoChecklistDocuments).values(data).returning();
    return result[0];
  }

  async deactivate(id: number) {
    await database.update(vehiculoChecklistDocuments).set({ activo: false }).where(eq(vehiculoChecklistDocuments.id, id));
  }

  async activate(id: number) {
    await database.update(vehiculoChecklistDocuments).set({ activo: true }).where(eq(vehiculoChecklistDocuments.id, id));
  }

  // ========== ITEMS ==========

  async createItems(items: VehiculoChecklistDocumentItemDTO[]) {
    if (items.length === 0) return [];
    return await database.insert(vehiculoChecklistDocumentItems).values(items).returning();
  }

  async deleteItems(documentId: number) {
    await database.delete(vehiculoChecklistDocumentItems).where(eq(vehiculoChecklistDocumentItems.vehiculoChecklistDocumentId, documentId));
  }

  async findItemsByDocumentId(documentId: number) {
    return await database
      .select()
      .from(vehiculoChecklistDocumentItems)
      .where(eq(vehiculoChecklistDocumentItems.vehiculoChecklistDocumentId, documentId))
      .orderBy(vehiculoChecklistDocumentItems.orden);
  }
}

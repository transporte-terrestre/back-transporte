import { Injectable } from '@nestjs/common';
import { eq, and, desc, sql, getTableColumns, asc } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { vehiculoChecklistDocuments, VehiculoChecklistDocumentDTO } from '@db/tables/vehiculo-checklist-document.table';
import { vehiculoChecklistDocumentItems, VehiculoChecklistDocumentItemDTO } from '@db/tables/vehiculo-checklist-document-item.table';
import { checklistItems } from '@db/tables/checklist-item.table';
import { viajes } from '@db/tables/viaje.table';
import { VehiculoChecklistDocumentViajeTipo } from '@db/tables/vehiculo-checklist-document.table';

@Injectable()
export class VehiculoChecklistDocumentRepository {
  async getViajeDate(viajeId: number): Promise<Date | null> {
    const result = await database.select({ fechaSalida: viajes.fechaSalida }).from(viajes).where(eq(viajes.id, viajeId)).limit(1);
    return result[0]?.fechaSalida || null;
  }

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

  // Optimizado: Trae solo 1 documento por item (Prioridad: ViajeActual > Activo > Último)
  async findAllByVehiculoId(vehiculoId: number, context?: { viajeId: number; tipo: VehiculoChecklistDocumentViajeTipo }) {
    return await database
      .selectDistinctOn([vehiculoChecklistDocuments.checklistItemId], { ...getTableColumns(vehiculoChecklistDocuments) })
      .from(vehiculoChecklistDocuments)
      .where(and(eq(vehiculoChecklistDocuments.vehiculoId, vehiculoId), sql`${vehiculoChecklistDocuments.eliminadoEn} IS NULL`))
      .orderBy(
        vehiculoChecklistDocuments.checklistItemId,
        context
          ? sql`CASE WHEN ${vehiculoChecklistDocuments.viajeId} = ${context.viajeId} AND ${vehiculoChecklistDocuments.viajeTipo} = ${context.tipo} THEN 0 ELSE 1 END`
          : sql`1`,
        desc(vehiculoChecklistDocuments.activo),
        sql`${vehiculoChecklistDocuments.viajeId} DESC NULLS LAST`,
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

  async deactivateActive(vehiculoId: number, checklistItemId: number) {
    await database
      .update(vehiculoChecklistDocuments)
      .set({ activo: false })
      .where(
        and(
          eq(vehiculoChecklistDocuments.vehiculoId, vehiculoId),
          eq(vehiculoChecklistDocuments.checklistItemId, checklistItemId),
          eq(vehiculoChecklistDocuments.activo, true),
        ),
      );
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
  // Buscar documento por ID con sus items
  async findByIdWithItems(id: number) {
    const doc = await database
      .select({ ...getTableColumns(vehiculoChecklistDocuments) })
      .from(vehiculoChecklistDocuments)
      .where(eq(vehiculoChecklistDocuments.id, id))
      .limit(1)
      .then((rows) => rows[0]);

    if (!doc) return null;

    const items = await this.findItemsByDocumentId(id);

    return { ...doc, items };
  }

  // Buscar mejor documento (Activo o Reciente) por Vehiculo y ItemID, con items
  async findActiveOrLatestWithItems(vehiculoId: number, checklistItemId: number) {
    const doc = await database
      .select({ ...getTableColumns(vehiculoChecklistDocuments) })
      .from(vehiculoChecklistDocuments)
      .where(
        and(
          eq(vehiculoChecklistDocuments.vehiculoId, vehiculoId),
          eq(vehiculoChecklistDocuments.checklistItemId, checklistItemId),
          sql`${vehiculoChecklistDocuments.eliminadoEn} IS NULL`,
        ),
      )
      .orderBy(
        sql`${vehiculoChecklistDocuments.viajeId} DESC NULLS LAST`,
        desc(vehiculoChecklistDocuments.activo),
        desc(vehiculoChecklistDocuments.creadoEn),
      )
      .limit(1)
      .then((rows) => rows[0]);

    if (!doc) return null;

    const items = await this.findItemsByDocumentId(doc.id);

    return { ...doc, items };
  }

  async findByViajeAndTipo(vehiculoId: number, checklistItemId: number, viajeId: number, tipo: 'salida' | 'llegada') {
    const result = await database
      .select()
      .from(vehiculoChecklistDocuments)
      .where(
        and(
          eq(vehiculoChecklistDocuments.vehiculoId, vehiculoId),
          eq(vehiculoChecklistDocuments.checklistItemId, checklistItemId),
          eq(vehiculoChecklistDocuments.viajeId, viajeId),
          eq(vehiculoChecklistDocuments.viajeTipo, tipo),
          sql`${vehiculoChecklistDocuments.eliminadoEn} IS NULL`,
        ),
      )
      .orderBy(desc(vehiculoChecklistDocuments.creadoEn))
      .limit(1);

    return result[0];
  }
}

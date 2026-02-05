import { pgTable, serial, integer, boolean, jsonb, timestamp, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { viajeChecklists } from './viaje-checklist.table';
import { vehiculoChecklistDocuments } from './vehiculo-checklist-document.table';
import { checklistItems } from './checklist-item.table';

export const viajeChecklistItems = pgTable(
  'viaje_checklist_items',
  {
    id: serial('id').primaryKey(),
    viajeChecklistId: integer('viaje_checklist_id')
      .references(() => viajeChecklists.id, { onDelete: 'cascade' })
      .notNull(),
    checklistItemId: integer('checklist_item_id')
      .references(() => checklistItems.id)
      .notNull(),
    vehiculoChecklistDocumentId: integer('vehiculo_checklist_document_id')
      .references(() => vehiculoChecklistDocuments.id)
      .notNull(),
    observacion: text('observacion'),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [uniqueIndex('viaje_checklist_items_unique_idx').on(t.viajeChecklistId, t.checklistItemId)],
);

export type ViajeChecklistItem = typeof viajeChecklistItems.$inferSelect;
export type ViajeChecklistItemDTO = typeof viajeChecklistItems.$inferInsert;

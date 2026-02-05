import { pgTable, integer, timestamp, text, primaryKey } from 'drizzle-orm/pg-core';
import { viajeChecklists } from './viaje-checklist.table';
import { vehiculoChecklistDocuments } from './vehiculo-checklist-document.table';
import { checklistItems } from './checklist-item.table';

export const viajeChecklistItems = pgTable(
  'viaje_checklist_items',
  {
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
  },
  (t) => [primaryKey({ columns: [t.viajeChecklistId, t.checklistItemId] })],
);

export type ViajeChecklistItem = typeof viajeChecklistItems.$inferSelect;
export type ViajeChecklistItemDTO = typeof viajeChecklistItems.$inferInsert;

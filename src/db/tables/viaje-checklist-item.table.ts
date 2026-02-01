import { pgTable, integer, boolean, text, timestamp, primaryKey, index } from 'drizzle-orm/pg-core';
import { viajeChecklists } from './viaje-checklist.table';
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
    completado: boolean('completado').default(false).notNull(),
    observacion: text('observacion'),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.viajeChecklistId, t.checklistItemId] }), index('viaje_checklist_items_checklist_id_idx').on(t.viajeChecklistId)],
);

export type ViajeChecklistItem = typeof viajeChecklistItems.$inferSelect;
export type ViajeChecklistItemDTO = typeof viajeChecklistItems.$inferInsert;

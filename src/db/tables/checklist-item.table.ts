import { pgTable, serial, varchar, timestamp, text } from 'drizzle-orm/pg-core';

export const checklistItems = pgTable('checklist_items', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull(), // Ej: "Inspección de Herramientas", "Documentación"
  descripcion: text('descripcion'),
  creadoEn: timestamp('creado_en').defaultNow().notNull(),
  actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
  eliminadoEn: timestamp('eliminado_en'),
});

export type ChecklistItem = typeof checklistItems.$inferSelect;
export type ChecklistItemDTO = typeof checklistItems.$inferInsert;

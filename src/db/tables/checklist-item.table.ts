import { pgTable, serial, varchar, integer, boolean, timestamp, pgEnum, index } from 'drizzle-orm/pg-core';

export const checklistItemSeccion = pgEnum('checklist_item_seccion', ['conductor', 'supervision']);

export const checklistItems = pgTable(
  'checklist_items',
  {
    id: serial('id').primaryKey(),
    seccion: checklistItemSeccion('seccion').notNull(),
    nombre: varchar('nombre', { length: 100 }).notNull(),
    descripcion: varchar('descripcion', { length: 200 }),
    icono: varchar('icono', { length: 50 }),
    orden: integer('orden').default(1).notNull(),
    activo: boolean('activo').default(true).notNull(),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [index('checklist_items_seccion_idx').on(t.seccion), index('checklist_items_orden_idx').on(t.seccion, t.orden)],
);

export type ChecklistItemSeccion = (typeof checklistItemSeccion.enumValues)[number];
export type ChecklistItem = typeof checklistItems.$inferSelect;
export type ChecklistItemDTO = typeof checklistItems.$inferInsert;

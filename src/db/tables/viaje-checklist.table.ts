import { pgTable, serial, integer, timestamp, pgEnum, text, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { viajes } from './viaje.table';
import { conductores } from './conductor.table';

export const viajeChecklistTipo = pgEnum('viaje_checklist_tipo', ['salida', 'llegada']);

export const viajeChecklists = pgTable(
  'viaje_checklists',
  {
    id: serial('id').primaryKey(),
    viajeId: integer('viaje_id')
      .references(() => viajes.id, { onDelete: 'cascade' })
      .notNull(),
    tipo: viajeChecklistTipo('tipo').notNull(),
    validadoPor: integer('validado_por').references(() => conductores.id),
    validadoEn: timestamp('validado_en'),
    observaciones: text('observaciones'),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
  },
  (t) => [index('viaje_checklists_viaje_id_idx').on(t.viajeId), uniqueIndex('viaje_checklists_viaje_tipo_unique_idx').on(t.viajeId, t.tipo)],
);

export type ViajeChecklistTipo = (typeof viajeChecklistTipo.enumValues)[number];
export type ViajeChecklist = typeof viajeChecklists.$inferSelect;
export type ViajeChecklistDTO = typeof viajeChecklists.$inferInsert;

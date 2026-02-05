import { pgTable, serial, integer, boolean, timestamp, uniqueIndex, text, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { vehiculos } from './vehiculo.table';
import { checklistItems } from './checklist-item.table';
import { viajes } from './viaje.table';

export const vehiculoChecklistDocuments = pgTable(
  'vehiculo_checklist_documents',
  {
    id: serial('id').primaryKey(),
    vehiculoId: integer('vehiculo_id')
      .notNull()
      .references(() => vehiculos.id),
    checklistItemId: integer('checklist_item_id')
      .notNull()
      .references(() => checklistItems.id), // "Tipo de Checklist"

    // Version ahora es TEXTO (el código generado)
    version: text('version').notNull(),

    activo: boolean('activo').default(true).notNull(),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),

    viajeId: integer('viaje_id').references(() => viajes.id),
  },
  (t) => [
    // Unique Index por Version (String)
    uniqueIndex('vehiculo_checklist_document_version_unique_idx')
      .on(t.vehiculoId, t.checklistItemId, t.version)
      .where(sql`${t.eliminadoEn} IS NULL`),

    // Unique Index Activo
    uniqueIndex('vehiculo_checklist_document_active_unique_idx')
      .on(t.vehiculoId, t.checklistItemId)
      .where(sql`${t.activo} IS TRUE AND ${t.eliminadoEn} IS NULL`),

    // Index por viaje
    index('vehiculo_checklist_document_viaje_idx').on(t.viajeId),
  ],
);

export type VehiculoChecklistDocument = typeof vehiculoChecklistDocuments.$inferSelect;
export type VehiculoChecklistDocumentDTO = typeof vehiculoChecklistDocuments.$inferInsert;

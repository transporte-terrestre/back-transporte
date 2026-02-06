import { pgTable, serial, integer, varchar, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { vehiculoChecklistDocuments } from './vehiculo-checklist-document.table';

// Enum para tipo de input en el formulario dinámico
export const checklistInputEnum = pgEnum('checklist_input_tipo', ['check', 'texto', 'fecha', 'cantidad', 'foto', 'opciones']);

export const vehiculoChecklistDocumentItems = pgTable('vehiculo_checklist_document_items', {
  id: serial('id').primaryKey(),
  vehiculoChecklistDocumentId: integer('vehiculo_checklist_document_id')
    .notNull()
    .references(() => vehiculoChecklistDocuments.id, { onDelete: 'cascade' }), // Si borro el documento, borro sus items
  label: varchar('label', { length: 255 }).notNull(), // Ej: "Extintor PQS"
  tipoInput: checklistInputEnum('tipo_input').notNull(),
  valorEsperado: varchar('valor_esperado', { length: 255 }), // Ej: "Vigente", "true"
  orden: integer('orden').default(0).notNull(),
  metadatos: jsonb('metadatos').$type<Record<string, any>>(), // { fecha_vencimiento: true, url_foto_referencia: '...' }
});

export type ChecklistInputTipo = (typeof checklistInputEnum.enumValues)[number];
export type VehiculoChecklistDocumentItem = typeof vehiculoChecklistDocumentItems.$inferSelect;
export type VehiculoChecklistDocumentItemDTO = typeof vehiculoChecklistDocumentItems.$inferInsert;

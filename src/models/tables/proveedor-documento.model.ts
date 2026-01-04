import { pgTable, serial, integer, varchar, timestamp, date } from 'drizzle-orm/pg-core';
import { proveedores } from './proveedor.model';

export const proveedorDocumentos = pgTable('proveedor_documentos', {
  id: serial('id').primaryKey(),
  proveedorId: integer('proveedor_id')
    .references(() => proveedores.id, { onDelete: 'cascade' })
    .notNull(),
  tipo: varchar('tipo', { length: 100 }).notNull(),
  numero: varchar('numero', { length: 100 }),
  fechaEmision: date('fecha_emision'),
  fechaVencimiento: date('fecha_vencimiento'),
  archivos: varchar('archivos', { length: 255 }).array().default([]),
  creadoEn: timestamp('creado_en').defaultNow().notNull(),
  actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
  eliminadoEn: timestamp('eliminado_en'),
});

export type ProveedorDocumento = typeof proveedorDocumentos.$inferSelect;
export type ProveedorDocumentoDTO = typeof proveedorDocumentos.$inferInsert;

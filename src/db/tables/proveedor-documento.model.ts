import { pgTable, serial, pgEnum, date, timestamp, text, integer } from 'drizzle-orm/pg-core';
import { proveedores } from './proveedor.model';

export const proveedorDocumentosTipo = pgEnum('proveedor_documentos_tipo', ['dni', 'ruc', 'contrato', 'otros']);

export const proveedorDocumentos = pgTable('proveedor_documentos', {
  id: serial('id').primaryKey(),
  proveedorId: integer('proveedor_id')
    .notNull()
    .references(() => proveedores.id, { onDelete: 'cascade' }),
  tipo: proveedorDocumentosTipo('tipo').notNull(),
  nombre: text('nombre').notNull(),
  url: text('url').notNull(),
  fechaExpiracion: date('fecha_expiracion'),
  fechaEmision: date('fecha_emision'),
  creadoEn: timestamp('creado_en').defaultNow().notNull(),
  actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
});

export type ProveedorDocumentoTipo = (typeof proveedorDocumentosTipo.enumValues)[number];
export type ProveedorDocumento = typeof proveedorDocumentos.$inferSelect;
export type ProveedorDocumentoDTO = typeof proveedorDocumentos.$inferInsert;

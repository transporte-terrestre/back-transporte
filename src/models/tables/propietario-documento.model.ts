import { pgTable, serial, pgEnum, date, timestamp, text, integer } from 'drizzle-orm/pg-core';
import { propietarios } from './propietario.model';

export const propietarioDocumentosTipo = pgEnum('propietario_documentos_tipo', ['dni', 'ruc', 'contrato', 'otros']);

export const propietarioDocumentos = pgTable('propietario_documentos', {
  id: serial('id').primaryKey(),
  propietarioId: integer('propietario_id')
    .notNull()
    .references(() => propietarios.id, { onDelete: 'cascade' }),
  tipo: propietarioDocumentosTipo('tipo').notNull(),
  nombre: text('nombre').notNull(),
  url: text('url').notNull(),
  fechaExpiracion: date('fecha_expiracion'),
  fechaEmision: date('fecha_emision'),
  creadoEn: timestamp('creado_en').defaultNow().notNull(),
  actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
});

export type PropietarioDocumentoTipo = (typeof propietarioDocumentosTipo.enumValues)[number];
export type PropietarioDocumento = typeof propietarioDocumentos.$inferSelect;
export type PropietarioDocumentoDTO = typeof propietarioDocumentos.$inferInsert;

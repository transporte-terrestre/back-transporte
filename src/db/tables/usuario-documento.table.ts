import { pgTable, serial, pgEnum, date, timestamp, text, integer } from 'drizzle-orm/pg-core';
import { usuarios } from './usuario.table';

export const usuarioDocumentosTipo = pgEnum('usuario_documentos_tipo', ['dni', 'seguro_vida_ley', 'sctr', 'examen_medico', 'induccion_general']);

export const usuarioDocumentos = pgTable('usuario_documentos', {
  id: serial('id').primaryKey(),
  usuarioId: integer('usuario_id')
    .notNull()
    .references(() => usuarios.id, { onDelete: 'cascade' }),
  tipo: usuarioDocumentosTipo('tipo').notNull(),
  nombre: text('nombre').notNull(),
  url: text('url').notNull(),
  fechaExpiracion: date('fecha_expiracion'),
  fechaEmision: date('fecha_emision'),
  creadoEn: timestamp('creado_en').defaultNow().notNull(),
  actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
});

export type UsuarioDocumentoTipo = (typeof usuarioDocumentosTipo.enumValues)[number];
export type UsuarioDocumento = typeof usuarioDocumentos.$inferSelect;
export type UsuarioDocumentoDTO = typeof usuarioDocumentos.$inferInsert;

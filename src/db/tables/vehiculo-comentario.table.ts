import { pgTable, serial, integer, timestamp, text, pgEnum } from 'drizzle-orm/pg-core';
import { usuarios } from './usuario.table';
import { vehiculos } from './vehiculo.table';

export const vehiculoComentariosTipo = pgEnum('vehiculo_comentarios_tipo', ['observacion', 'incidencia', 'novedad', 'general']);

export const vehiculoComentarios = pgTable('vehiculo_comentarios', {
  id: serial('id').primaryKey(),
  vehiculoId: integer('vehiculo_id')
    .references(() => vehiculos.id, { onDelete: 'cascade' })
    .notNull(),
  usuarioId: integer('usuario_id')
    .references(() => usuarios.id, { onDelete: 'cascade' })
    .notNull(),
  comentario: text('comentario').notNull(),
  tipo: vehiculoComentariosTipo('tipo').notNull(),
  creadoEn: timestamp('creado_en').defaultNow().notNull(),
  actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
});

export type VehiculoComentarioTipo = (typeof vehiculoComentariosTipo.enumValues)[number];
export type VehiculoComentario = typeof vehiculoComentarios.$inferSelect;
export type VehiculoComentarioDTO = typeof vehiculoComentarios.$inferInsert;

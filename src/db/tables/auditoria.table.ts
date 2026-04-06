import { pgEnum, pgTable, serial, integer, varchar, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { usuarios } from './usuario.table';

export const auditoriaAccion = pgEnum('auditoria_accion', ['CREAR', 'EDITAR', 'ELIMINAR']);

export const auditorias = pgTable(
  'auditorias',
  {
    id: serial('id').primaryKey(),
    accion: auditoriaAccion('accion').notNull(),
    usuarioId: integer('usuario_id')
      .references(() => usuarios.id)
      .notNull(),
    modulo: varchar('modulo', { length: 255 }).notNull(),
    detalle: jsonb('detalle').notNull(),
    fechaHora: timestamp('fecha_hora').defaultNow().notNull(),
  },
  (t) => [
    index('auditorias_usuario_id_idx').on(t.usuarioId),
    index('auditorias_accion_idx').on(t.accion),
    index('auditorias_modulo_idx').on(t.modulo),
    index('auditorias_fecha_hora_idx').on(t.fechaHora),
  ],
);

export type AuditoriaAccion = (typeof auditoriaAccion.enumValues)[number];
export type Auditoria = typeof auditorias.$inferSelect;
export type AuditoriaDTO = typeof auditorias.$inferInsert;

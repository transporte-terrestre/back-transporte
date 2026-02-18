import { pgTable, serial, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { conductores } from './conductor.table';
import { notificaciones } from './notificacion.table';

export const notificacionesConductorLeidas = pgTable('notificaciones_conductor_leidas', {
  id: serial('id').primaryKey(),
  conductorId: integer('conductor_id')
    .references(() => conductores.id)
    .notNull(),
  notificacionId: integer('notificacion_id')
    .references(() => notificaciones.id)
    .notNull(),
  creadoEn: timestamp('creado_en').defaultNow().notNull(),
  leidoEn: timestamp('leido_en'),
});

export type NotificacionConductorLeida = typeof notificacionesConductorLeidas.$inferSelect;
export type NotificacionConductorLeidaDTO = typeof notificacionesConductorLeidas.$inferInsert;

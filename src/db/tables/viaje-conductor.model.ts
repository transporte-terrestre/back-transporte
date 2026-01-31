import { pgTable, integer, timestamp, boolean, pgEnum, primaryKey } from 'drizzle-orm/pg-core';
import { viajes } from './viaje.model';
import { conductores } from './conductor.model';

export const viajeConductoresRol = pgEnum('viaje_conductores_rol', ['conductor', 'copiloto', 'auxiliar']);

export const viajeConductores = pgTable(
  'viaje_conductores',
  {
    viajeId: integer('viaje_id')
      .references(() => viajes.id, { onDelete: 'cascade' })
      .notNull(),
    conductorId: integer('conductor_id')
      .references(() => conductores.id, { onDelete: 'cascade' })
      .notNull(),
    esPrincipal: boolean('es_principal').default(false).notNull(),
    rol: viajeConductoresRol('rol').notNull(),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.viajeId, t.conductorId] })],
);

export type ViajeConductorRol = (typeof viajeConductoresRol.enumValues)[number];
export type ViajeConductor = typeof viajeConductores.$inferSelect;
export type ViajeConductorDTO = typeof viajeConductores.$inferInsert;

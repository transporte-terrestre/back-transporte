import { boolean, index, integer, pgTable, primaryKey, timestamp } from 'drizzle-orm/pg-core';
import { viajes } from './viaje.table';
import { pasajeros } from './pasajero.table';

export const viajePasajeros = pgTable(
  'viaje_pasajeros',
  {
    viajeId: integer('viaje_id')
      .notNull()
      .references(() => viajes.id, { onDelete: 'cascade' }),
    pasajeroId: integer('pasajero_id')
      .notNull()
      .references(() => pasajeros.id, { onDelete: 'cascade' }),
    asistencia: boolean('asistencia').default(false).notNull(),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.viajeId, t.pasajeroId] }),
    index('viaje_pasajeros_viaje_id_idx').on(t.viajeId),
    index('viaje_pasajeros_pasajero_id_idx').on(t.pasajeroId),
  ],
);

export type ViajePasajero = typeof viajePasajeros.$inferSelect;
export type ViajePasajeroDTO = typeof viajePasajeros.$inferInsert;

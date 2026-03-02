import { boolean, index, integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { viajes } from './viaje.table';
import { pasajeros } from './pasajero.table';

export const viajePasajeros = pgTable(
  'viaje_pasajeros',
  {
    id: serial('id').primaryKey(), // Agregar ID único para permitir pasajero_id NULL
    viajeId: integer('viaje_id')
      .notNull()
      .references(() => viajes.id, { onDelete: 'cascade' }),
    pasajeroId: integer('pasajero_id').references(() => pasajeros.id, { onDelete: 'cascade' }), // Ahora puede ser null para pasajeros ad-hoc

    // Campos para pasajeros no registrados o cargados desde Excel
    dni: varchar('dni', { length: 20 }),
    nombres: varchar('nombres', { length: 200 }),
    apellidos: varchar('apellidos', { length: 200 }),

    asistencia: boolean('asistencia').default(false).notNull(),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
  },
  (t) => [
    index('viaje_pasajeros_viaje_id_idx').on(t.viajeId),
    index('viaje_pasajeros_pasajero_id_idx').on(t.pasajeroId),
    index('viaje_pasajeros_dni_idx').on(t.dni),
  ],
);

export type ViajePasajero = typeof viajePasajeros.$inferSelect;
export type ViajePasajeroDTO = typeof viajePasajeros.$inferInsert;

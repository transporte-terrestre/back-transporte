import { pgTable, serial, integer, text, timestamp, doublePrecision, pgEnum, index } from 'drizzle-orm/pg-core';
import { viajes } from './viaje.table';

export const tipoServicioEnum = pgEnum('tipo_servicio', ['trayecto', 'descanso']);

export const viajeServicios = pgTable(
  'viaje_servicios',
  {
    id: serial('id').primaryKey(),
    viajeId: integer('viaje_id')
      .references(() => viajes.id, { onDelete: 'cascade' })
      .notNull(),
    orden: integer('orden').notNull(),
    tipo: tipoServicioEnum('tipo').notNull().default('trayecto'),
    longitud: doublePrecision('longitud'),
    latitud: doublePrecision('latitud'),
    nombreLugar: text('nombre_lugar'),
    horaFinal: timestamp('hora_final'),
    kilometrajeFinal: doublePrecision('kilometraje_final'),
    numeroPasajeros: integer('numero_pasajeros').default(0),
    observaciones: text('observaciones'),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
  },
  (t) => [
    index('viaje_servicios_viaje_id_idx').on(t.viajeId),
    index('viaje_servicios_viaje_orden_idx').on(t.viajeId, t.orden),
  ],
);

export type ViajeServicio = typeof viajeServicios.$inferSelect;
export type ViajeServicioDTO = typeof viajeServicios.$inferInsert;

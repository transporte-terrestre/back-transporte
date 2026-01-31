import { pgTable, serial, integer, varchar, text, timestamp, time, index } from 'drizzle-orm/pg-core';
import { viajes } from './viaje.table';
import { rutaParadas } from './ruta-parada.table';

export const viajeServicios = pgTable(
  'viaje_servicios',
  {
    id: serial('id').primaryKey(),
    viajeId: integer('viaje_id')
      .references(() => viajes.id, { onDelete: 'cascade' })
      .notNull(),
    orden: integer('orden').notNull(), // Secuencia del servicio en el día (1, 2, 3...)

    // Punto de partida: referencia a parada fija O texto libre
    paradaPartidaId: integer('parada_partida_id').references(() => rutaParadas.id),
    paradaPartidaOcasional: varchar('parada_partida_ocasional', { length: 200 }),

    // Punto de llegada: referencia a parada fija O texto libre
    paradaLlegadaId: integer('parada_llegada_id').references(() => rutaParadas.id),
    paradaLlegadaOcasional: varchar('parada_llegada_ocasional', { length: 200 }),

    // Datos del servicio
    horaSalida: time('hora_salida').notNull(),
    horaTermino: time('hora_termino'),
    kmInicial: integer('km_inicial').notNull(),
    kmFinal: integer('km_final'),
    numeroPasajeros: integer('numero_pasajeros').default(0),

    // Observaciones
    observaciones: text('observaciones'),

    // Timestamps
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
  },
  (t) => [
    // Índice para filtrar servicios por viaje
    index('viaje_servicios_viaje_id_idx').on(t.viajeId),
    // Índice para ordenar servicios dentro de un viaje
    index('viaje_servicios_viaje_orden_idx').on(t.viajeId, t.orden),
  ],
);

export type ViajeServicio = typeof viajeServicios.$inferSelect;
export type ViajeServicioDTO = typeof viajeServicios.$inferInsert;

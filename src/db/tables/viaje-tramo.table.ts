import { pgTable, serial, integer, text, timestamp, doublePrecision, pgEnum, index } from 'drizzle-orm/pg-core';
import { viajes } from './viaje.table';
import { rutaParadas } from './ruta-parada.table';

export const tipoTramoEnum = pgEnum('tipo_tramo', ['origen', 'punto', 'parada', 'descanso', 'destino']);

export const viajeTramos = pgTable(
  'viaje_tramos',
  {
    id: serial('id').primaryKey(),
    viajeId: integer('viaje_id')
      .references(() => viajes.id, { onDelete: 'cascade' })
      .notNull(),
    tipo: tipoTramoEnum('tipo').notNull().default('parada'),
    longitud: doublePrecision('longitud'),
    latitud: doublePrecision('latitud'),
    nombreLugar: text('nombre_lugar'),
    horaFinal: timestamp('hora_final'),
    kilometrajeFinal: doublePrecision('kilometraje_final'),
    numeroPasajeros: integer('numero_pasajeros').default(0),
    rutaParadaId: integer('ruta_parada_id').references(() => rutaParadas.id, { onDelete: 'set null' }),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [index('viaje_tramos_viaje_id_idx').on(t.viajeId), index('viaje_tramos_hora_final_idx').on(t.horaFinal)],
);

export type ViajeTramoTipo = (typeof tipoTramoEnum.enumValues)[number];
export type ViajeTramo = typeof viajeTramos.$inferSelect;
export type ViajeTramoDTO = typeof viajeTramos.$inferInsert;

import { pgTable, serial, integer, text, timestamp, doublePrecision, pgEnum, index } from 'drizzle-orm/pg-core';
import { viajes } from './viaje.table';
import { rutaParadas } from './ruta-parada.table';

export const tipoServicioEnum = pgEnum('tipo_servicio', ['origen', 'punto', 'parada', 'descanso', 'destino']);

export const viajeServicios = pgTable(
  'viaje_servicios',
  {
    id: serial('id').primaryKey(),
    viajeId: integer('viaje_id')
      .references(() => viajes.id, { onDelete: 'cascade' })
      .notNull(),
    tipo: tipoServicioEnum('tipo').notNull().default('parada'),
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
  (t) => [index('viaje_servicios_viaje_id_idx').on(t.viajeId), index('viaje_servicios_hora_final_idx').on(t.horaFinal)],
);

export type ViajeServicioTipo = (typeof tipoServicioEnum.enumValues)[number];
export type ViajeServicio = typeof viajeServicios.$inferSelect;
export type ViajeServicioDTO = typeof viajeServicios.$inferInsert;

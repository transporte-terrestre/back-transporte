import { pgTable, serial, integer, timestamp, pgEnum, index } from 'drizzle-orm/pg-core';
import { viajePasajeros } from './viaje-pasajero.table';
import { viajeTramos } from './viaje-tramo.table';

export const tipoMovimientoEnum = pgEnum('tipo_movimiento_pasajero', ['entrada', 'salida']);

export const viajePasajeroMovimientos = pgTable(
  'viaje_pasajero_movimientos',
  {
    id: serial('id').primaryKey(),
    viajePasajeroId: integer('viaje_pasajero_id')
      .references(() => viajePasajeros.id, { onDelete: 'cascade' })
      .notNull(),
    viajeTramoId: integer('viaje_tramo_id')
      .references(() => viajeTramos.id, { onDelete: 'cascade' })
      .notNull(),
    tipoMovimiento: tipoMovimientoEnum('tipo_movimiento').notNull().default('entrada'),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [
    index('viaje_pasajero_movimientos_viaje_pasajero_id_idx').on(t.viajePasajeroId),
    index('viaje_pasajero_movimientos_viaje_tramo_id_idx').on(t.viajeTramoId),
  ],
);

export type tipoMovimientoPasajero = (typeof tipoMovimientoEnum.enumValues)[number];
export type ViajePasajeroMovimiento = typeof viajePasajeroMovimientos.$inferSelect;
export type ViajePasajeroMovimientoDTO = typeof viajePasajeroMovimientos.$inferInsert;

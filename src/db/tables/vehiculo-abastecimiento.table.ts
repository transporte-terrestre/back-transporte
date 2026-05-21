import { pgTable, serial, integer, timestamp, decimal, index } from 'drizzle-orm/pg-core';
import { viajeTramos } from './viaje-tramo.table';
import { combustibleEnum, vehiculos } from './vehiculo.table';

export const vehiculoAbastecimientos = pgTable(
  'vehiculo_abastecimientos',
  {
    id: serial('id').primaryKey(),
    vehiculoId: integer('vehiculo_id')
      .references(() => vehiculos.id, { onDelete: 'cascade' })
      .notNull(),
    viajeTramoId: integer('viaje_tramo_id')
      .references(() => viajeTramos.id, { onDelete: 'set null' }),
    combustible: combustibleEnum('combustible').notNull(),
    galonesEstablecidos: decimal('galones_establecidos', { precision: 10, scale: 2 }).notNull(),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [
    index('vehiculo_abastecimientos_vehiculo_id_idx').on(t.vehiculoId),
    index('vehiculo_abastecimientos_viaje_tramo_id_idx').on(t.viajeTramoId),
  ],
);

export type VehiculoAbastecimiento = typeof vehiculoAbastecimientos.$inferSelect;
export type VehiculoAbastecimientoDTO = typeof vehiculoAbastecimientos.$inferInsert;

import { pgTable, serial, integer, timestamp, decimal, index } from 'drizzle-orm/pg-core';
import { viajeTramos } from './viaje-tramo.table';
import { combustibleEnum } from './vehiculo.table';

export const viajeRepostajeMovimientos = pgTable(
  'viaje_repostaje_movimientos',
  {
    id: serial('id').primaryKey(),
    viajeTramoId: integer('viaje_tramo_id')
      .references(() => viajeTramos.id, { onDelete: 'cascade' })
      .notNull(),
    combustible: combustibleEnum('combustible').notNull(),
    galonesEstablecidos: decimal('galones_establecidos', { precision: 10, scale: 2 }).notNull(),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [
    index('viaje_repostaje_movimientos_viaje_tramo_id_idx').on(t.viajeTramoId),
  ],
);

export type ViajeRepostajeMovimiento = typeof viajeRepostajeMovimientos.$inferSelect;
export type ViajeRepostajeMovimientoDTO = typeof viajeRepostajeMovimientos.$inferInsert;

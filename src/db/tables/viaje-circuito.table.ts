import { pgTable, serial, integer, timestamp, index, varchar } from 'drizzle-orm/pg-core';
import { viajes } from './viaje.table';

export const viajeCircuitos = pgTable(
  'viaje_circuitos',
  {
    id: serial('id').primaryKey(),
    viajeIdaId: integer('viaje_ida_id').references(() => viajes.id, { onDelete: 'restrict' }),
    viajeVueltaId: integer('viaje_vuelta_id').references(() => viajes.id, { onDelete: 'restrict' }),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [index('viaje_circuitos_viaje_ida_idx').on(t.viajeIdaId), index('viaje_circuitos_viaje_vuelta_idx').on(t.viajeVueltaId)],
);

export type ViajeCircuito = typeof viajeCircuitos.$inferSelect;
export type ViajeCircuitoDTO = typeof viajeCircuitos.$inferInsert;

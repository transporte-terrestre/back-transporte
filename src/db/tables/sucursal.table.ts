import { pgTable, serial, varchar, timestamp, index, integer } from 'drizzle-orm/pg-core';
import { talleres } from './taller.table';

export const sucursales = pgTable(
  'sucursales',
  {
    id: serial('id').primaryKey(),
    tallerId: integer('taller_id')
      .references(() => talleres.id, { onDelete: 'cascade' })
      .notNull(),
    distrito: varchar('distrito', { length: 100 }).notNull(),
    ubicacionExacta: varchar('ubicacion_exacta', { length: 255 }).notNull(),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [
    index('sucursales_taller_id_idx').on(t.tallerId),
    index('sucursales_distrito_idx').using('gin', t.distrito.op('gin_trgm_ops')),
  ],
);

export type Sucursal = typeof sucursales.$inferSelect;
export type SucursalDTO = typeof sucursales.$inferInsert;

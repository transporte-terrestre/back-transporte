import { pgTable, serial, varchar, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { talleres } from './taller.table';
import { sucursales } from './sucursal.table';

export const tallerSucursales = pgTable(
  'taller_sucursales',
  {
    id: serial('id').primaryKey(),
    tallerId: integer('taller_id')
      .references(() => talleres.id, { onDelete: 'cascade' })
      .notNull(),
    sucursalId: integer('sucursal_id')
      .references(() => sucursales.id, { onDelete: 'cascade' })
      .notNull(),
    direccion: varchar('direccion', { length: 255 }).default('Sin especificar').notNull(),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
  },
  (t) => [uniqueIndex('taller_sucursales_unique_idx').on(t.tallerId, t.sucursalId)],
);

export type TallerSucursal = typeof tallerSucursales.$inferSelect;
export type TallerSucursalDTO = typeof tallerSucursales.$inferInsert;

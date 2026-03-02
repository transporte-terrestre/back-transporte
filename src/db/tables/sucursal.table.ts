import { pgTable, serial, varchar, timestamp, index } from 'drizzle-orm/pg-core';

export const sucursales = pgTable(
  'sucursales',
  {
    id: serial('id').primaryKey(),
    nombre: varchar('nombre', { length: 200 }).notNull(),
    direccion: varchar('direccion', { length: 255 }),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [index('sucursales_nombre_idx').using('gin', t.nombre.op('gin_trgm_ops'))],
);

export type Sucursal = typeof sucursales.$inferSelect;
export type SucursalDTO = typeof sucursales.$inferInsert;

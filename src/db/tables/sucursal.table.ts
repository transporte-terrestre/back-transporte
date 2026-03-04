import { pgTable, serial, varchar, timestamp, index } from 'drizzle-orm/pg-core';

export const sucursales = pgTable(
  'sucursales',
  {
    id: serial('id').primaryKey(),
    departamento: varchar('departamento', { length: 100 }).notNull(),
    provincia: varchar('provincia', { length: 100 }).notNull(),
    distrito: varchar('distrito', { length: 100 }).notNull(),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [
    index('sucursales_departamento_idx').using('gin', t.departamento.op('gin_trgm_ops')),
    index('sucursales_provincia_idx').using('gin', t.provincia.op('gin_trgm_ops')),
    index('sucursales_distrito_idx').using('gin', t.distrito.op('gin_trgm_ops')),
  ],
);

export type Sucursal = typeof sucursales.$inferSelect;
export type SucursalDTO = typeof sucursales.$inferInsert;

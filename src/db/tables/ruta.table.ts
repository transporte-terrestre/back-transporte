import { pgTable, serial, varchar, decimal, timestamp, index } from 'drizzle-orm/pg-core';

export const rutas = pgTable(
  'rutas',
  {
    id: serial('id').primaryKey(),
    origen: varchar('origen', { length: 100 }).notNull(),
    destino: varchar('destino', { length: 100 }).notNull(),
    origenLat: decimal('origen_lat', { precision: 10, scale: 7 }).notNull(),
    origenLng: decimal('origen_lng', { precision: 10, scale: 7 }).notNull(),
    destinoLat: decimal('destino_lat', { precision: 10, scale: 7 }).notNull(),
    destinoLng: decimal('destino_lng', { precision: 10, scale: 7 }).notNull(),
    distancia: decimal('distancia', { precision: 10, scale: 2 }).notNull(),
    costoBase: decimal('costo_base', { precision: 10, scale: 2 }).notNull(),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [
    // Índices de búsqueda
    index('rutas_origen_idx').using('gin', t.origen.op('gin_trgm_ops')),
    index('rutas_destino_idx').using('gin', t.destino.op('gin_trgm_ops')),
  ],
);

export type Ruta = typeof rutas.$inferSelect;
export type RutaDTO = typeof rutas.$inferInsert;

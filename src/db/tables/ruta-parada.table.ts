import { pgTable, serial, integer, varchar, decimal, timestamp, index } from 'drizzle-orm/pg-core';
import { rutas } from './ruta.table';

export const rutaParadas = pgTable(
  'ruta_paradas',
  {
    id: serial('id').primaryKey(),
    rutaId: integer('ruta_id')
      .references(() => rutas.id, { onDelete: 'cascade' })
      .notNull(),
    orden: integer('orden').notNull(),
    nombre: varchar('nombre', { length: 200 }).notNull(),
    ubicacionLat: decimal('ubicacion_lat', { precision: 10, scale: 7 }),

    ubicacionLng: decimal('ubicacion_lng', { precision: 10, scale: 7 }),
    distanciaPreviaParada: decimal('distancia_previa_parada', { precision: 10, scale: 2 }),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [
    // Índice para búsqueda rápida por nombre
    index('ruta_paradas_nombre_idx').using('gin', t.nombre.op('gin_trgm_ops')),
    // Índice para filtrar por ruta
    index('ruta_paradas_ruta_id_idx').on(t.rutaId),
    // Índice para ordenar paradas dentro de una ruta
    index('ruta_paradas_ruta_orden_idx').on(t.rutaId, t.orden),
  ],
);

export type RutaParada = typeof rutaParadas.$inferSelect;
export type RutaParadaDTO = typeof rutaParadas.$inferInsert;

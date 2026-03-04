import { pgTable, serial, integer, varchar, decimal, timestamp } from 'drizzle-orm/pg-core';
import { rutas } from './ruta.table';

export const rutaParadas = pgTable('ruta_paradas', {
  id: serial('id').primaryKey(),
  rutaId: integer('ruta_id')
    .references(() => rutas.id, { onDelete: 'cascade' })
    .notNull(),
  orden: integer('orden').notNull(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  ubicacionLat: decimal('ubicacion_lat', { precision: 10, scale: 7 }).notNull(),
  ubicacionLng: decimal('ubicacion_lng', { precision: 10, scale: 7 }).notNull(),
  distanciaPreviaParada: decimal('distancia_previa_parada', { precision: 10, scale: 2 }),
  tiempoEstimado: integer('tiempo_estimado'), // En caso quieran guardar tiempo_estimado desde la anterior
  creadoEn: timestamp('creado_en').defaultNow().notNull(),
  actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
  eliminadoEn: timestamp('eliminado_en'),
});

export type RutaParada = typeof rutaParadas.$inferSelect;
export type RutaParadaDTO = typeof rutaParadas.$inferInsert;

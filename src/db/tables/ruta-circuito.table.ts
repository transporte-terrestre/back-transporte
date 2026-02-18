import { pgTable, serial, varchar, integer, timestamp, index, boolean } from 'drizzle-orm/pg-core';
import { rutas } from './ruta.table';

export const rutaCircuitos = pgTable(
  'ruta_circuitos',
  {
    id: serial('id').primaryKey(),
    nombre: varchar('nombre', { length: 200 }).notNull(),
    rutaIdaId: integer('ruta_ida_id').references(() => rutas.id, { onDelete: 'restrict' }),
    rutaVueltaId: integer('ruta_vuelta_id').references(() => rutas.id, { onDelete: 'restrict' }),
    esIgual: boolean('es_igual').default(false).notNull(),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [
    // Índice de búsqueda por nombre
    index('ruta_circuitos_nombre_idx').using('gin', t.nombre.op('gin_trgm_ops')),
    // Índice para filtrar por ruta ida
    index('ruta_circuitos_ruta_ida_idx').on(t.rutaIdaId),
    // Índice para filtrar por ruta vuelta
    index('ruta_circuitos_ruta_vuelta_idx').on(t.rutaVueltaId),
  ],
);

export type RutaCircuito = typeof rutaCircuitos.$inferSelect;
export type RutaCircuitoDTO = typeof rutaCircuitos.$inferInsert;

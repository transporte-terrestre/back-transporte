import { pgTable, serial, timestamp, integer, decimal, boolean, index } from 'drizzle-orm/pg-core';
import { alquileres, alquilerTipo } from './alquiler.table';
import { vehiculos } from './vehiculo.table';
import { conductores } from './conductor.table';

export const alquilerDetalle = pgTable(
  'alquiler_detalle',
  {
    id: serial('id').primaryKey(),
    alquilerId: integer('alquiler_id')
      .notNull()
      .references(() => alquileres.id, { onDelete: 'cascade' }),
    vehiculoId: integer('vehiculo_id')
      .notNull()
      .references(() => vehiculos.id, { onDelete: 'restrict' }),
    conductorId: integer('conductor_id')
      .references(() => conductores.id, { onDelete: 'restrict' }),

    tipo: alquilerTipo('tipo').default('maquina_seca').notNull(),

    kilometrajeInicial: decimal('kilometraje_inicial', { precision: 12, scale: 2, mode: 'number' }).notNull(),
    kilometrajeFinal: decimal('kilometraje_final', { precision: 12, scale: 2, mode: 'number' }),

    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [
    index('alquiler_detalle_alquiler_id_idx').on(t.alquilerId),
    index('alquiler_detalle_vehiculo_id_idx').on(t.vehiculoId),
  ],
);

export type AlquilerDetalle = typeof alquilerDetalle.$inferSelect;
export type AlquilerDetalleDTO = typeof alquilerDetalle.$inferInsert;

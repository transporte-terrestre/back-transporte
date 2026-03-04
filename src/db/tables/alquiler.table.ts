import { pgTable, serial, varchar, timestamp, integer, decimal, index } from 'drizzle-orm/pg-core';
import { vehiculos } from './vehiculo.table';

export const alquileres = pgTable(
  'alquileres',
  {
    id: serial('id').primaryKey(),
    vehiculoId: integer('vehiculo_id')
      .notNull()
      .references(() => vehiculos.id, { onDelete: 'restrict' }),

    fechaInicio: timestamp('fecha_inicio').notNull(),
    fechaFin: timestamp('fecha_fin'),

    monto: decimal('monto', { precision: 10, scale: 2 }), // Monto acordado
    observaciones: varchar('observaciones', { length: 500 }),

    estado: varchar('estado', { length: 50 }).default('activo').notNull(), // activo, finalizado, cancelado

    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [index('alquileres_vehiculo_id_idx').on(t.vehiculoId), index('alquileres_estado_idx').on(t.estado)],
);

export type Alquiler = typeof alquileres.$inferSelect;
export type AlquilerDTO = typeof alquileres.$inferInsert;

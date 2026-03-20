import { pgTable, serial, varchar, timestamp, integer, decimal, pgEnum, index } from 'drizzle-orm/pg-core';
import { alquileres } from './alquiler.table';
import { vehiculos } from './vehiculo.table';

export const alquilerHistorialAccion = pgEnum('alquiler_historial_accion', [
  'ALTA_VEHICULO',
  'BAJA_VEHICULO',
  'CAMBIO_PRECIO',
]);

export const alquilerHistorial = pgTable(
  'alquiler_historial',
  {
    id: serial('id').primaryKey(),
    alquilerId: integer('alquiler_id')
      .notNull()
      .references(() => alquileres.id, { onDelete: 'cascade' }),
    vehiculoId: integer('vehiculo_id')
      .references(() => vehiculos.id, { onDelete: 'restrict' }),

    tipoAccion: alquilerHistorialAccion('tipo_accion').notNull(),

    montoAnterior: decimal('monto_anterior', { precision: 10, scale: 2, mode: 'number' }),
    montoNuevo: decimal('monto_nuevo', { precision: 10, scale: 2, mode: 'number' }),

    motivo: varchar('motivo', { length: 500 }),
    fechaAccion: timestamp('fecha_accion').defaultNow().notNull(),

    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [
    index('alquiler_historial_alquiler_id_idx').on(t.alquilerId),
  ],
);

export type AlquilerHistorial = typeof alquilerHistorial.$inferSelect;
export type AlquilerHistorialDTO = typeof alquilerHistorial.$inferInsert;

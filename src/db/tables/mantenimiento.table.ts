import { pgTable, serial, varchar, integer, decimal, timestamp, text } from 'drizzle-orm/pg-core';
import { talleres } from './taller.table';
import { pgEnum } from 'drizzle-orm/pg-core';
import { vehiculos } from './vehiculo.table';
import { sucursales } from './sucursal.table';

export const mantenimientosTipo = pgEnum('mantenimientos_tipo', ['preventivo', 'correctivo']);

export const mantenimientosEstado = pgEnum('mantenimientos_estado', ['pendiente', 'en_proceso', 'finalizado']);

export const mantenimientos = pgTable('mantenimientos', {
  id: serial('id').primaryKey(),
  vehiculoId: integer('vehiculo_id')
    .references(() => vehiculos.id)
    .notNull(),
  tallerId: integer('taller_id').references(() => talleres.id),
  sucursalId: integer('sucursal_id').references(() => sucursales.id),
  codigoOrden: varchar('codigo_orden', { length: 50 }),
  tipo: mantenimientosTipo('tipo').notNull(),
  costoTotal: decimal('costo_total', { precision: 10, scale: 2 }).default('0').notNull(),
  descripcion: text('descripcion').notNull(),
  fechaIngreso: timestamp('fecha_ingreso').notNull(),
  fechaSalida: timestamp('fecha_salida'),
  kilometraje: decimal('kilometraje', { precision: 10, scale: 2, mode: 'number' }).notNull(),
  kilometrajeProximoMantenimiento: decimal('kilometraje_proximo_mantenimiento', { precision: 10, scale: 2, mode: 'number' }),
  estado: mantenimientosEstado('estado').default('pendiente').notNull(),
  creadoEn: timestamp('creado_en').defaultNow().notNull(),
  actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
  eliminadoEn: timestamp('eliminado_en'),
});

export type MantenimientoTipo = (typeof mantenimientosTipo.enumValues)[number];
export type MantenimientoEstado = (typeof mantenimientosEstado.enumValues)[number];
export type Mantenimiento = typeof mantenimientos.$inferSelect;
export type MantenimientoDTO = typeof mantenimientos.$inferInsert;

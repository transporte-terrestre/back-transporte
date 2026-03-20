import { pgTable, serial, varchar, timestamp, integer, decimal, index, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { vehiculos } from './vehiculo.table';
import { clientes } from './cliente.table';
import { conductores } from './conductor.table';

export const alquilerTipo = pgEnum('alquiler_tipo', ['maquina_seca', 'maquina_operada']);
export const alquilerEstado = pgEnum('alquiler_estado', ['activo', 'finalizado', 'cancelado']);

export const alquileres = pgTable(
  'alquileres',
  {
    id: serial('id').primaryKey(),
    clienteId: integer('cliente_id')
      .notNull()
      .references(() => clientes.id, { onDelete: 'restrict' }),

    montoPorDia: decimal('monto_por_dia', { precision: 10, scale: 2, mode: 'number' }).notNull(),
    montoTotalFinal: decimal('monto_total_final', { precision: 10, scale: 2, mode: 'number' }),
    
    razon: varchar('razon', { length: 500 }),
    observaciones: varchar('observaciones', { length: 500 }),

    fechaInicio: timestamp('fecha_inicio').notNull(),
    fechaFin: timestamp('fecha_fin'),
    esIndefinido: boolean('es_indefinido').default(false).notNull(),

    estado: alquilerEstado('estado').default('activo').notNull(),

    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [
    index('alquileres_cliente_id_idx').on(t.clienteId),
    index('alquileres_estado_idx').on(t.estado),
  ],
);

export type Alquiler = typeof alquileres.$inferSelect;
export type AlquilerDTO = typeof alquileres.$inferInsert;
export type AlquilerTipo = (typeof alquilerTipo.enumValues)[number];
export type AlquilerEstado = (typeof alquilerEstado.enumValues)[number];

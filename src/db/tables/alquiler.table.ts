import { pgTable, serial, varchar, timestamp, integer, decimal, index, pgEnum } from 'drizzle-orm/pg-core';
import { vehiculos } from './vehiculo.table';
import { clientes } from './cliente.table';
import { conductores } from './conductor.table';

export const alquilerTipo = pgEnum('alquiler_tipo', ['maquina_seca', 'maquina_operada']);

export const alquileres = pgTable(
  'alquileres',
  {
    id: serial('id').primaryKey(),
    clienteId: integer('cliente_id')
      .notNull()
      .references(() => clientes.id, { onDelete: 'restrict' }),
    vehiculoId: integer('vehiculo_id')
      .notNull()
      .references(() => vehiculos.id, { onDelete: 'restrict' }),
    conductorId: integer('conductor_id').references(() => conductores.id, { onDelete: 'restrict' }),

    tipo: alquilerTipo('tipo').default('maquina_seca').notNull(),

    kilometrajeInicial: decimal('kilometraje_inicial', { precision: 12, scale: 2, mode: 'number' }).notNull(),
    kilometrajeFinal: decimal('kilometraje_final', { precision: 12, scale: 2, mode: 'number' }),

    montoPorDia: decimal('monto_por_dia', { precision: 10, scale: 2, mode: 'number' }).notNull(),
    montoTotalFinal: decimal('monto_total_final', { precision: 10, scale: 2, mode: 'number' }),
    razon: varchar('razon', { length: 500 }),

    fechaInicio: timestamp('fecha_inicio').notNull(),
    fechaFin: timestamp('fecha_fin'),

    monto: decimal('monto', { precision: 10, scale: 2 }), // Monto acordado
    observaciones: varchar('observaciones', { length: 500 }),

    estado: varchar('estado', { length: 50 }).default('activo').notNull(), // activo, finalizado, cancelado

    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [
    index('alquileres_cliente_id_idx').on(t.clienteId),
    index('alquileres_vehiculo_id_idx').on(t.vehiculoId),
    index('alquileres_conductor_id_idx').on(t.conductorId),
    index('alquileres_tipo_idx').on(t.tipo),
    index('alquileres_estado_idx').on(t.estado),
  ],
);

export type Alquiler = typeof alquileres.$inferSelect;
export type AlquilerDTO = typeof alquileres.$inferInsert;
export type AlquilerTipo = (typeof alquilerTipo.enumValues)[number];

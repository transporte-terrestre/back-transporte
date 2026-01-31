import { pgTable, serial, integer, timestamp, pgEnum, varchar, text, decimal } from 'drizzle-orm/pg-core';
import { rutas } from './ruta.table';
import { clientes } from './cliente.table';

export const viajesEstado = pgEnum('viajes_estado', ['programado', 'en_progreso', 'completado', 'cancelado']);

export const modalidadServicio = pgEnum('viajes_modalidad_servicio', ['regular', 'expreso', 'ejecutivo', 'especial', 'turismo', 'corporativo']);

export const viajesTipoRuta = pgEnum('viajes_tipo_ruta', ['ocasional', 'fija']);

export const viajesTurno = pgEnum('viajes_turno', ['dia', 'noche']);

export const viajes = pgTable('viajes', {
  id: serial('id').primaryKey(),
  rutaId: integer('ruta_id').references(() => rutas.id),
  rutaOcasional: varchar('ruta_ocasional', { length: 500 }),
  distanciaEstimada: decimal('distancia_estimada', { precision: 10, scale: 2 }), // Distancia estimada del viaje
  distanciaFinal: decimal('distancia_final', { precision: 10, scale: 2 }), // Distancia real al final del viaje
  tipoRuta: viajesTipoRuta('tipo_ruta').default('fija').notNull(),
  clienteId: integer('cliente_id')
    .references(() => clientes.id)
    .notNull(),
  tripulantes: text('tripulantes').array(),
  modalidadServicio: modalidadServicio('modalidad_servicio').default('regular').notNull(),
  horasContrato: decimal('horas_contrato', { precision: 10, scale: 2 }).default('0.00').notNull(),
  estado: viajesEstado('estado').default('programado').notNull(),
  turno: viajesTurno('turno'), // Turno del viaje: día o noche
  numeroVale: varchar('numero_vale', { length: 50 }), // Número de vale de combustible
  fechaSalida: timestamp('fecha_salida').notNull(),
  fechaLlegada: timestamp('fecha_llegada'),
  creadoEn: timestamp('creado_en').defaultNow().notNull(),
  actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
  eliminadoEn: timestamp('eliminado_en'),
});

export type ViajeEstado = (typeof viajesEstado.enumValues)[number];
export type ViajeTipoRuta = (typeof viajesTipoRuta.enumValues)[number];
export type ViajeModalidadServicio = (typeof modalidadServicio.enumValues)[number];
export type ViajeTurno = (typeof viajesTurno.enumValues)[number];
export type Viaje = typeof viajes.$inferSelect;
export type ViajeDTO = typeof viajes.$inferInsert;

import { pgEnum, pgTable, serial, varchar, integer, timestamp, text, index, uniqueIndex, decimal } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { modelos } from './modelo.model';

export const combustibleEnum = pgEnum('combustible_tipo', ['gasolina', 'diesel', 'gnv', 'glp', 'electrico', 'hibrido']);

export const vehiculosEstado = pgEnum('vehiculos_estado', ['disponible', 'circulacion', 'taller', 'retirado']);

export const vehiculos = pgTable(
  'vehiculos',
  {
    id: serial('id').primaryKey(),
    placa: varchar('placa', { length: 20 }).notNull(),
    codigoInterno: varchar('codigo_interno', { length: 50 }),

    modeloId: integer('modelo_id')
      .notNull()
      .references(() => modelos.id, { onDelete: 'restrict' }),

    anio: integer('anio').notNull(),
    anioModelo: integer('anio_modelo'),

    vin: varchar('vin', { length: 50 }),
    numeroMotor: varchar('numero_motor', { length: 50 }),
    numeroSerie: varchar('numero_serie', { length: 50 }),

    color: varchar('color', { length: 50 }),
    combustible: combustibleEnum('combustible'),
    carroceria: varchar('carroceria', { length: 50 }),
    categoria: varchar('categoria', { length: 10 }),

    cargaUtil: decimal('carga_util_kg', { precision: 10, scale: 2 }),
    pesoBruto: decimal('peso_bruto_kg', { precision: 10, scale: 2 }),
    pesoNeto: decimal('peso_neto_kg', { precision: 10, scale: 2 }),
    asientos: integer('asientos').default(0),
    pasajeros: integer('pasajeros').default(0),
    ejes: integer('ejes').default(2),
    ruedas: integer('ruedas').default(4),

    kilometraje: integer('kilometraje').default(0).notNull(),
    estado: vehiculosEstado('estado').default('disponible').notNull(),
    imagenes: text('imagenes').array().default([]),

    placaAnterior: varchar('placa_anterior', { length: 20 }),

    anotaciones: text('anotaciones'),
    sede: varchar('sede', { length: 100 }),

    potencia: varchar('potencia', { length: 50 }),
    formulaRodante: varchar('formula_rodante', { length: 50 }),
    version: varchar('version', { length: 50 }),
    cilindros: integer('cilindros'),
    cilindrada: varchar('cilindrada', { length: 50 }),

    longitud: decimal('longitud', { precision: 10, scale: 2 }),
    altura: decimal('altura', { precision: 10, scale: 2 }),
    ancho: decimal('ancho', { precision: 10, scale: 2 }),

    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [
    index('vehiculos_modelo_id_idx').on(t.modeloId),
    index('vehiculos_placa_idx').using('gin', t.placa.op('gin_trgm_ops')),
    index('vehiculos_codigo_interno_idx').on(t.codigoInterno),

    index('vehiculos_vin_idx').on(t.vin),
    index('vehiculos_motor_idx').on(t.numeroMotor),

    uniqueIndex('vehiculos_placa_unique_active_idx')
      .on(t.placa)
      .where(sql`${t.eliminadoEn} IS NULL`),
    uniqueIndex('vehiculos_codigo_interno_unique_active_idx')
      .on(t.codigoInterno)
      .where(sql`${t.eliminadoEn} IS NULL`),

    uniqueIndex('vehiculos_vin_unique_active_idx')
      .on(t.vin)
      .where(sql`${t.eliminadoEn} IS NULL`),
  ],
);

export type VehiculoEstado = (typeof vehiculosEstado.enumValues)[number];
export type CombustibleTipo = (typeof combustibleEnum.enumValues)[number];
export type Vehiculo = typeof vehiculos.$inferSelect;
export type VehiculoDTO = typeof vehiculos.$inferInsert;

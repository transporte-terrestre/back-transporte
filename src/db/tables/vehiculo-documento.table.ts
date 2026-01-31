import { pgTable, serial, pgEnum, date, timestamp, text, integer } from 'drizzle-orm/pg-core';
import { vehiculos } from './vehiculo.table';

export const vehiculoDocumentosTipo = pgEnum('vehiculo_documentos_tipo', [
  'tarjeta_propiedad',
  'tarjeta_unica_circulacion',
  'citv',
  'soat',
  'poliza',
  'certificado_operatividad_factura',
  'plan_mantenimiento_historico',
  'certificado_instalacion_gps',
  'certificado_valor_anadido',
  'constancia_gps',
  'certificado_tacos',
  'certificado_extintores_hidrostatica',
  'certificado_norma_r66',
  'certificado_laminados_lunas',
  'certificado_carroceria',
  'certificado_caracteristicas_tecnicas',
  'certificado_adas',
  'otros',
]);

export const vehiculoDocumentos = pgTable('vehiculo_documentos', {
  id: serial('id').primaryKey(),
  vehiculoId: integer('vehiculo_id')
    .notNull()
    .references(() => vehiculos.id, { onDelete: 'cascade' }),
  tipo: vehiculoDocumentosTipo('tipo').notNull(),
  nombre: text('nombre').notNull(),
  url: text('url').notNull(),
  fechaExpiracion: date('fecha_expiracion'),
  fechaEmision: date('fecha_emision'),
  creadoEn: timestamp('creado_en').defaultNow().notNull(),
  actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
});

export type VehiculoDocumentoTipo = (typeof vehiculoDocumentosTipo.enumValues)[number];
export type VehiculoDocumento = typeof vehiculoDocumentos.$inferSelect;
export type VehiculoDocumentoDTO = typeof vehiculoDocumentos.$inferInsert;

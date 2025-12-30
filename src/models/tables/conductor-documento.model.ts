import { pgTable, serial, pgEnum, date, timestamp, text, integer } from 'drizzle-orm/pg-core';
import { conductores } from './conductor.model';

export const conductorDocumentosTipo = pgEnum('conductor_documentos_tipo', [
  'dni',
  'licencia_mtc',
  'seguro_vida_ley',
  'sctr',
  'examen_medico',
  'psicosensometrico',
  'induccion_general',
  'manejo_defensivo',
  'licencia_interna',
  'autoriza_ssgg',
  'curso_seguridad_portuaria',
  'curso_mercancias_peligrosas',
  'curso_basico_pbip',
  'examen_medico_temporal',
  'induccion_visita',
  'em_visita',
  'pase_conduc',
  'foto_funcionario',
]);

export const conductorDocumentos = pgTable('conductor_documentos', {
  id: serial('id').primaryKey(),
  conductorId: integer('conductor_id')
    .notNull()
    .references(() => conductores.id, { onDelete: 'cascade' }),
  tipo: conductorDocumentosTipo('tipo').notNull(),
  nombre: text('nombre').notNull(),
  url: text('url').notNull(),
  fechaExpiracion: date('fecha_expiracion').notNull(),
  fechaEmision: date('fecha_emision').notNull(),
  creadoEn: timestamp('creado_en').defaultNow().notNull(),
  actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
});

export type ConductorDocumentoTipo = (typeof conductorDocumentosTipo.enumValues)[number];
export type ConductorDocumento = typeof conductorDocumentos.$inferSelect;
export type ConductorDocumentoDTO = typeof conductorDocumentos.$inferInsert;

import { pgTable, serial, text, timestamp, integer, pgEnum, index } from 'drizzle-orm/pg-core';
import { alquileres } from './alquiler.table';

export const alquilerDocumentosTipo = pgEnum('alquiler_documentos_tipo', [
  'contrato',
  'guia_remision',
  'acta_entrega',
  'acta_devolucion',
  'comprobante_pago',
  'otros',
]);

export const alquilerDocumentos = pgTable(
  'alquiler_documentos',
  {
    id: serial('id').primaryKey(),
    alquilerId: integer('alquiler_id')
      .notNull()
      .references(() => alquileres.id, { onDelete: 'cascade' }),
    tipo: alquilerDocumentosTipo('tipo').default('otros').notNull(),
    nombre: text('nombre').notNull(),
    url: text('url').notNull(),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
  },
  (t) => [index('alquiler_documentos_alquiler_id_idx').on(t.alquilerId), index('alquiler_documentos_tipo_idx').on(t.tipo)],
);

export type AlquilerDocumentoTipo = (typeof alquilerDocumentosTipo.enumValues)[number];
export type AlquilerDocumento = typeof alquilerDocumentos.$inferSelect;
export type AlquilerDocumentoDTO = typeof alquilerDocumentos.$inferInsert;

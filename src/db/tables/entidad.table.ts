import { pgTable, serial, integer, varchar, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { clientes } from './cliente.table';

export const entidades = pgTable(
  'entidades',
  {
    id: serial('id').primaryKey(),
    clienteId: integer('cliente_id')
      .notNull()
      .references(() => clientes.id, { onDelete: 'cascade' }),
    nombreServicio: varchar('nombre_servicio', { length: 200 }).notNull(),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [
    index('entidades_cliente_id_idx').on(t.clienteId),
    index('entidades_nombre_servicio_idx').using('gin', t.nombreServicio.op('gin_trgm_ops')),

    uniqueIndex('entidades_cliente_nombre_unique_active_idx')
      .on(t.clienteId, t.nombreServicio)
      .where(sql`${t.eliminadoEn} IS NULL`),
  ],
);

export type Entidad = typeof entidades.$inferSelect;
export type EntidadDTO = typeof entidades.$inferInsert;

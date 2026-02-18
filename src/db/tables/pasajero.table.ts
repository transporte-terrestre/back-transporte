import { pgTable, serial, integer, varchar, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { clientes } from './cliente.table';

export const pasajeros = pgTable(
  'pasajeros',
  {
    id: serial('id').primaryKey(),
    clienteId: integer('cliente_id')
      .notNull()
      .references(() => clientes.id, { onDelete: 'cascade' }),
    dni: varchar('dni', { length: 20 }).notNull(),
    nombres: varchar('nombres', { length: 100 }).notNull(),
    apellidos: varchar('apellidos', { length: 100 }).notNull(),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [
    index('pasajeros_cliente_id_idx').on(t.clienteId),
    index('pasajeros_dni_idx').on(t.dni),
    index('pasajeros_nombres_idx').using('gin', t.nombres.op('gin_trgm_ops')),
    index('pasajeros_apellidos_idx').using('gin', t.apellidos.op('gin_trgm_ops')),

    uniqueIndex('pasajeros_cliente_dni_unique_active_idx')
      .on(t.clienteId, t.dni)
      .where(sql`${t.eliminadoEn} IS NULL`),
  ],
);

export type Pasajero = typeof pasajeros.$inferSelect;
export type PasajeroDTO = typeof pasajeros.$inferInsert;

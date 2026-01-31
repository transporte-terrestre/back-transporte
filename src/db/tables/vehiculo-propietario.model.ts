import { pgTable, integer, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { vehiculos } from './vehiculo.model';
import { propietarios } from './propietario.model';

export const vehiculoPropietarios = pgTable(
  'vehiculo_propietarios',
  {
    vehiculoId: integer('vehiculo_id')
      .references(() => vehiculos.id, { onDelete: 'cascade' })
      .notNull(),
    propietarioId: integer('propietario_id')
      .references(() => propietarios.id, { onDelete: 'cascade' })
      .notNull(),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.vehiculoId, t.propietarioId] })],
);

export type VehiculoPropietario = typeof vehiculoPropietarios.$inferSelect;
export type VehiculoPropietarioDTO = typeof vehiculoPropietarios.$inferInsert;

import { pgTable, integer, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { vehiculos } from './vehiculo.table';
import { proveedores } from './proveedor.table';

export const vehiculoProveedores = pgTable(
  'vehiculo_proveedores',
  {
    vehiculoId: integer('vehiculo_id')
      .references(() => vehiculos.id, { onDelete: 'cascade' })
      .notNull(),
    proveedorId: integer('proveedor_id')
      .references(() => proveedores.id, { onDelete: 'cascade' })
      .notNull(),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.vehiculoId, t.proveedorId] })],
);

export type VehiculoProveedor = typeof vehiculoProveedores.$inferSelect;
export type VehiculoProveedorDTO = typeof vehiculoProveedores.$inferInsert;

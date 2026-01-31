import { pgTable, integer, timestamp, boolean, pgEnum, primaryKey } from 'drizzle-orm/pg-core';
import { viajes } from './viaje.model';
import { vehiculos } from './vehiculo.model';

export const viajeVehiculosRol = pgEnum('viaje_vehiculos_rol', ['principal', 'apoyo', 'emergencia']);

export const viajeVehiculos = pgTable(
  'viaje_vehiculos',
  {
    viajeId: integer('viaje_id')
      .references(() => viajes.id, { onDelete: 'cascade' })
      .notNull(),
    vehiculoId: integer('vehiculo_id')
      .references(() => vehiculos.id, { onDelete: 'cascade' })
      .notNull(),
    esPrincipal: boolean('es_principal').default(false).notNull(),
    rol: viajeVehiculosRol('rol').notNull(),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.viajeId, t.vehiculoId] })],
);

export type ViajeVehiculoRol = (typeof viajeVehiculosRol.enumValues)[number];
export type ViajeVehiculo = typeof viajeVehiculos.$inferSelect;
export type ViajeVehiculoDTO = typeof viajeVehiculos.$inferInsert;

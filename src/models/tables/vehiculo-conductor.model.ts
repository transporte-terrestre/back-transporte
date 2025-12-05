import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { vehiculos } from "./vehiculo.model";
import { conductores } from "./conductor.model";

export const vehiculosConductores = pgTable("vehiculos_conductores", {
  id: serial("id").primaryKey(),
  vehiculoId: integer("vehiculo_id").references(() => vehiculos.id).notNull(),
  conductorId: integer("conductor_id").references(() => conductores.id).notNull(),
  asignadoEn: timestamp("asignado_en").defaultNow().notNull(),
  desasignadoEn: timestamp("desasignado_en"),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export type VehiculoConductor = typeof vehiculosConductores.$inferSelect;
export type VehiculoConductorDTO = typeof vehiculosConductores.$inferInsert;

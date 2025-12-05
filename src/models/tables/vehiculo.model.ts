import { pgEnum } from "drizzle-orm/pg-core";
import {
  pgTable,
  serial,
  varchar,
  integer,
  date,
  timestamp,
} from "drizzle-orm/pg-core";

export const estadoVehiculo = pgEnum("estado_vehiculo", [
  "activo",
  "taller",
  "retirado",
]);

export const vehiculos = pgTable("vehiculos", {
  id: serial("id").primaryKey(),
  placa: varchar("placa", { length: 20 }).unique().notNull(),
  marca: varchar("marca", { length: 50 }).notNull(),
  modelo: varchar("modelo", { length: 50 }).notNull(),
  anio: integer("anio").notNull(),
  kilometraje: integer("kilometraje").default(0).notNull(),
  fechaVencimientoSoat: date("fecha_vencimiento_soat").notNull(),
  estado: estadoVehiculo("estado").default("activo").notNull(),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export type Vehiculo = typeof vehiculos.$inferSelect;
export type VehiculoDTO = typeof vehiculos.$inferInsert;

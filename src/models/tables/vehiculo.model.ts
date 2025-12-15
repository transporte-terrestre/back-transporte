import { pgEnum, pgTable, serial, varchar, integer, date, timestamp, text } from "drizzle-orm/pg-core";

export const vehiculosEstado = pgEnum("vehiculos_estado", [
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
  estado: vehiculosEstado("estado").default("activo").notNull(),
  imagenes: text("imagenes").array().default([]),
  documentos: text("documentos").array().default([]),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export type VehiculoEstado = typeof vehiculosEstado.enumValues[number];
export type Vehiculo = typeof vehiculos.$inferSelect;
export type VehiculoDTO = typeof vehiculos.$inferInsert;

import {
  pgEnum,
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

export const vehiculosEstado = pgEnum("vehiculos_estado", [
  "activo",
  "taller",
  "retirado",
]);

export const vehiculos = pgTable("vehiculos", {
  id: serial("id").primaryKey(),
  placa: varchar("placa", { length: 20 }).unique().notNull(),
  codigoInterno: varchar("codigo_interno", { length: 50 }).unique(),
  marca: varchar("marca", { length: 50 }).notNull(),
  modelo: varchar("modelo", { length: 50 }).notNull(),
  anio: integer("anio").notNull(),
  kilometraje: integer("kilometraje").default(0).notNull(),
  estado: vehiculosEstado("estado").default("activo").notNull(),
  imagenes: text("imagenes").array().default([]),
  documentos: text("documentos").array().default([]),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export type VehiculoEstado = (typeof vehiculosEstado.enumValues)[number];
export type Vehiculo = typeof vehiculos.$inferSelect;
export type VehiculoDTO = typeof vehiculos.$inferInsert;

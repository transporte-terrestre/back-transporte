import { pgTable, serial, varchar, integer, date, decimal, timestamp, text } from "drizzle-orm/pg-core";
import { vehiculos } from "./vehiculo.model";
import { pgEnum } from "drizzle-orm/pg-core";

export const mantenimientosTipo = pgEnum("mantenimientos_tipo", [
  "preventivo",
  "correctivo",
]);

export const mantenimientos = pgTable("mantenimientos", {
  id: serial("id").primaryKey(),
  vehiculoId: integer("vehiculo_id").references(() => vehiculos.id).notNull(),
  tipo: mantenimientosTipo("tipo").notNull(),
  costo: decimal("costo", { precision: 10, scale: 2 }).notNull(),
  descripcion: text("descripcion").notNull(),
  fecha: date("fecha").notNull(),
  kilometraje: integer("kilometraje").notNull(),
  proveedor: varchar("proveedor", { length: 100 }).notNull(),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export type MantenimientoTipo = typeof mantenimientosTipo.enumValues[number];
export type Mantenimiento = typeof mantenimientos.$inferSelect;
export type MantenimientoDTO = typeof mantenimientos.$inferInsert;

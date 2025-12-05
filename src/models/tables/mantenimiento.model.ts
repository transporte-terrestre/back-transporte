import {
  pgTable,
  serial,
  varchar,
  integer,
  date,
  decimal,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { vehiculos } from "./vehiculo.model";
import { pgEnum } from "drizzle-orm/pg-core";

export const tipoMantenimiento = pgEnum("tipo_mantenimiento", [
  "preventivo",
  "correctivo",
]);

export const mantenimientos = pgTable("mantenimientos", {
  id: serial("id").primaryKey(),
  vehiculoId: integer("vehiculo_id").references(() => vehiculos.id).notNull(),
  tipo: tipoMantenimiento("tipo").notNull(),
  costo: decimal("costo", { precision: 10, scale: 2 }).notNull(),
  descripcion: text("descripcion").notNull(),
  fecha: date("fecha").notNull(),
  kilometraje: integer("kilometraje").notNull(),
  proveedor: varchar("proveedor", { length: 100 }).notNull(),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export type Mantenimiento = typeof mantenimientos.$inferSelect;
export type MantenimientoDTO = typeof mantenimientos.$inferInsert;

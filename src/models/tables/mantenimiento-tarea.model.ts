import {
  pgTable,
  serial,
  integer,
  varchar,
  boolean,
  timestamp,
  decimal,
  time,
} from "drizzle-orm/pg-core";
import { mantenimientos } from "./mantenimiento.model";

export const mantenimientoTareas = pgTable("mantenimiento_tareas", {
  id: serial("id").primaryKey(),
  mantenimientoId: integer("mantenimiento_id").references(() => mantenimientos.id, { onDelete: "cascade" }).notNull(),
  codigo: varchar("codigo", { length: 50 }),
  categoria: varchar("categoria", { length: 100 }),
  descripcion: varchar("descripcion", { length: 255 }).notNull(),
  responsable: varchar("responsable", { length: 200 }),
  horaInicio: time("hora_inicio"),
  horaFin: time("hora_fin"),
  completada: boolean("completada").default(false).notNull(),
  costoEstimado: decimal("costo_estimado", { precision: 10, scale: 2 }),
  costoReal: decimal("costo_real", { precision: 10, scale: 2 }),
  observaciones: varchar("observaciones", { length: 500 }),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export type MantenimientoTarea = typeof mantenimientoTareas.$inferSelect;
export type MantenimientoTareaDTO = typeof mantenimientoTareas.$inferInsert;

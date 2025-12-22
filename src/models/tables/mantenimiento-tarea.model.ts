import {
  pgTable,
  serial,
  integer,
  varchar,
  boolean,
  timestamp,
  time,
} from "drizzle-orm/pg-core";
import { mantenimientos } from "./mantenimiento.model";
import { tareas } from "./tarea.model";

// Relación muchos a muchos entre mantenimientos y tareas
export const mantenimientoTareas = pgTable("mantenimiento_tareas", {
  id: serial("id").primaryKey(),
  mantenimientoId: integer("mantenimiento_id")
    .references(() => mantenimientos.id, { onDelete: "cascade" })
    .notNull(),
  tareaId: integer("tarea_id")
    .references(() => tareas.id, { onDelete: "restrict" })
    .notNull(),
  // Campos específicos de ejecución
  responsable: varchar("responsable", { length: 200 }),
  horaInicio: time("hora_inicio"),
  horaFin: time("hora_fin"),
  completada: boolean("completada").default(false).notNull(),
  observaciones: varchar("observaciones", { length: 500 }),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export type MantenimientoTarea = typeof mantenimientoTareas.$inferSelect;
export type MantenimientoTareaDTO = typeof mantenimientoTareas.$inferInsert;

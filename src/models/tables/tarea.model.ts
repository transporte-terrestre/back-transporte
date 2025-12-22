import {
  pgTable,
  serial,
  varchar,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Catálogo de tareas de mantenimiento (reutilizables)
export const tareas = pgTable(
  "tareas",
  {
    id: serial("id").primaryKey(),
    codigo: varchar("codigo", { length: 50 }).notNull(),
    descripcion: varchar("descripcion", { length: 255 }).notNull(),
    creadoEn: timestamp("creado_en").defaultNow().notNull(),
    actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
    eliminadoEn: timestamp("eliminado_en"),
  },
  (t) => [
    index("tarea_codigo_idx").on(t.codigo),
    index("tarea_descripcion_gin_idx").using(
      "gin",
      sql`${t.descripcion} gin_trgm_ops`
    ),
    uniqueIndex("tarea_codigo_unique_idx")
      .on(t.codigo)
      .where(sql`${t.eliminadoEn} IS NULL`),
  ]
);

export type Tarea = typeof tareas.$inferSelect;
export type TareaDTO = typeof tareas.$inferInsert;

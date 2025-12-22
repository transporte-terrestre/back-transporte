import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { marcas } from "./marca.model";

export const modelos = pgTable(
  "modelos",
  {
    id: serial("id").primaryKey(),
    nombre: text("nombre").notNull(),
    marcaId: integer("marca_id")
      .notNull()
      .references(() => marcas.id, { onDelete: "cascade" }),
    creadoEn: timestamp("creado_en").defaultNow().notNull(),
    actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
    eliminadoEn: timestamp("eliminado_en"),
  },
  (t) => [
    // Índices de búsqueda
    index("modelos_nombre_idx").using("gin", t.nombre.op("gin_trgm_ops")),
    index("modelos_marca_id_idx").on(t.marcaId),
    // Índice único parcial compuesto - nombre único por marca cuando no está eliminado
    uniqueIndex("modelos_nombre_marca_unique_active_idx")
      .on(t.nombre, t.marcaId)
      .where(sql`${t.eliminadoEn} IS NULL`),
  ]
);

export type Modelo = typeof modelos.$inferSelect;
export type ModeloDTO = typeof modelos.$inferInsert;

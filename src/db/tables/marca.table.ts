import {
  pgTable,
  serial,
  text,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const marcas = pgTable(
  "marcas",
  {
    id: serial("id").primaryKey(),
    nombre: text("nombre").notNull(),
    creadoEn: timestamp("creado_en").defaultNow().notNull(),
    actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
    eliminadoEn: timestamp("eliminado_en"),
  },
  (t) => [
    // Índice de búsqueda
    index("marcas_nombre_idx").using("gin", t.nombre.op("gin_trgm_ops")),
    // Índice único parcial - solo aplica cuando eliminadoEn IS NULL
    uniqueIndex("marcas_nombre_unique_active_idx")
      .on(t.nombre)
      .where(sql`${t.eliminadoEn} IS NULL`),
  ]
);

export type Marca = typeof marcas.$inferSelect;
export type MarcaDTO = typeof marcas.$inferInsert;

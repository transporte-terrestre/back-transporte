import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
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
  (t) => {
    return {
      nombreIndex: index("modelos_nombre_idx").using(
        "gin",
        t.nombre.op("gin_trgm_ops")
      ),
      marcaIdIndex: index("modelos_marca_id_idx").on(t.marcaId),
    };
  }
);

export type Modelo = typeof modelos.$inferSelect;
export type ModeloDTO = typeof modelos.$inferInsert;

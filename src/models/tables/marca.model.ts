import { pgTable, serial, text, timestamp, index } from "drizzle-orm/pg-core";

export const marcas = pgTable(
  "marcas",
  {
    id: serial("id").primaryKey(),
    nombre: text("nombre").notNull().unique(),
    creadoEn: timestamp("creado_en").defaultNow().notNull(),
    actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
    eliminadoEn: timestamp("eliminado_en"),
  },
  (t) => {
    return {
      nombreIndex: index("marcas_nombre_idx").using(
        "gin",
        t.nombre.op("gin_trgm_ops")
      ),
    };
  }
);

export type Marca = typeof marcas.$inferSelect;
export type MarcaDTO = typeof marcas.$inferInsert;

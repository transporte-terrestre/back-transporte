import {
  pgTable,
  serial,
  varchar,
  timestamp,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const talleresTipo = pgEnum("talleres_tipo", ["interno", "externo"]);

export const talleres = pgTable(
  "talleres",
  {
    id: serial("id").primaryKey(),
    ruc: varchar("ruc", { length: 20 }),
    razonSocial: varchar("razon_social", { length: 200 }).notNull(),
    nombreComercial: varchar("nombre_comercial", { length: 200 }),
    tipo: talleresTipo("tipo").default("externo").notNull(),
    telefono: varchar("telefono", { length: 20 }),
    email: varchar("email", { length: 100 }),
    direccion: varchar("direccion", { length: 255 }),
    creadoEn: timestamp("creado_en").defaultNow().notNull(),
    actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
    eliminadoEn: timestamp("eliminado_en"),
  },
  (t) => [
    // Índices de búsqueda
    index("talleres_razon_social_idx").using(
      "gin",
      t.razonSocial.op("gin_trgm_ops")
    ),
    index("talleres_nombre_comercial_idx").using(
      "gin",
      t.nombreComercial.op("gin_trgm_ops")
    ),
    index("talleres_ruc_idx").on(t.ruc),
    index("talleres_email_idx").on(t.email),
    index("talleres_telefono_idx").on(t.telefono),
    // Índice único parcial - solo aplica cuando eliminadoEn IS NULL
    uniqueIndex("talleres_ruc_unique_active_idx")
      .on(t.ruc)
      .where(sql`${t.eliminadoEn} IS NULL`),
  ]
);

export type TallerTipo = (typeof talleresTipo.enumValues)[number];
export type Taller = typeof talleres.$inferSelect;
export type TallerDTO = typeof talleres.$inferInsert;

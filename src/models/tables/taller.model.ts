import {
  pgTable,
  serial,
  varchar,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const talleresTipo = pgEnum("talleres_tipo", [
  "interno",
  "externo",
]);

export const talleres = pgTable("talleres", {
  id: serial("id").primaryKey(),
  ruc: varchar("ruc", { length: 20 }).unique(),
  razonSocial: varchar("razon_social", { length: 200 }).notNull(),
  nombreComercial: varchar("nombre_comercial", { length: 200 }),
  tipo: talleresTipo("tipo").default("externo").notNull(),
  telefono: varchar("telefono", { length: 20 }),
  email: varchar("email", { length: 100 }),
  direccion: varchar("direccion", { length: 255 }),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export type TallerTipo = typeof talleresTipo.enumValues[number];
export type Taller = typeof talleres.$inferSelect;
export type TallerDTO = typeof talleres.$inferInsert;

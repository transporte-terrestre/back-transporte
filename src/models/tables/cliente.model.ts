import { pgTable, serial, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const clientes = pgTable("clientes", {
  id: serial("id").primaryKey(),
  dni: varchar("dni", { length: 20 }).unique().notNull(),
  nombres: varchar("nombres", { length: 100 }).notNull(),
  apellidos: varchar("apellidos", { length: 100 }).notNull(),
  nombreCompleto: varchar("nombre_completo", { length: 200 }).notNull(),
  email: varchar("email", { length: 100 }).unique(),
  telefono: varchar("telefono", { length: 20 }),
  direccion: varchar("direccion", { length: 255 }),
  imagenes: text("imagenes").array().default([]),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export type Cliente = typeof clientes.$inferSelect;
export type ClienteDTO = typeof clientes.$inferInsert;

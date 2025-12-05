import { pgTable, serial, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const clientes = pgTable("clientes", {
  id: serial("id").primaryKey(),
  dni: varchar("dni", { length: 20 }).unique().notNull(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  apellido: varchar("apellido", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).unique(),
  telefono: varchar("telefono", { length: 20 }),
  direccion: varchar("direccion", { length: 255 }),
  imagenes: text("imagenes").array().default([]),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export type Cliente = typeof clientes.$inferSelect;
export type ClienteDTO = typeof clientes.$inferInsert;

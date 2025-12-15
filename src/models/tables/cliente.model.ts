import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  pgEnum,
} from "drizzle-orm/pg-core";

export const clientesTipoDocumento = pgEnum("clientes_tipo_documento", [
  "DNI",
  "RUC",
]);

export const clientes = pgTable("clientes", {
  id: serial("id").primaryKey(),
  tipoDocumento: clientesTipoDocumento("tipo_documento").default("DNI").notNull(),
  dni: varchar("dni", { length: 20 }).unique(),
  ruc: varchar("ruc", { length: 20 }).unique(),
  nombres: varchar("nombres", { length: 100 }),
  apellidos: varchar("apellidos", { length: 100 }),
  razonSocial: varchar("razon_social", { length: 200 }),
  nombreCompleto: varchar("nombre_completo", { length: 200 }).notNull(),
  email: varchar("email", { length: 100 }).unique(),
  telefono: varchar("telefono", { length: 20 }),
  direccion: varchar("direccion", { length: 255 }),
  imagenes: text("imagenes").array().default([]),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export type ClienteTipoDocumento = typeof clientesTipoDocumento.enumValues[number];
export type Cliente = typeof clientes.$inferSelect;
export type ClienteDTO = typeof clientes.$inferInsert;

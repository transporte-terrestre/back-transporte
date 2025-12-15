import { pgEnum, pgTable, serial, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const usuariosRol = pgEnum("usuarios_rol", ["empleado", "admin"]);

export const usuarios = pgTable("usuarios", {
  id: serial("id").primaryKey(),
  nombres: varchar("nombres", { length: 100 }).notNull(),
  apellidos: varchar("apellidos", { length: 100 }).notNull(),
  nombreCompleto: varchar("nombre_completo", { length: 200 }).notNull(),
  email: varchar("email", { length: 100 }).unique().notNull(),
  contrasenia: varchar("contrasenia", { length: 255 }).notNull(),
  roles: usuariosRol("roles").array().default(["empleado"]).notNull(),
  fotocheck: text("fotocheck").array().default([]),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export type UsuarioRol = typeof usuariosRol.enumValues[number];
export type Usuario = typeof usuarios.$inferSelect;
export type UsuarioDTO = typeof usuarios.$inferInsert;

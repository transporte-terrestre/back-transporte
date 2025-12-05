import {
  pgEnum,
  pgTable,
  serial,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const rolesUsuario = pgEnum("roles_usuario", ["empleado", "admin"]);

export const usuarios = pgTable("usuarios", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  apellido: varchar("apellido", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).unique().notNull(),
  contrasenia: varchar("contrasenia", { length: 255 }).notNull(),
  roles: rolesUsuario("roles").array().default(["empleado"]).notNull(),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export type Usuario = typeof usuarios.$inferSelect;
export type UsuarioDTO = typeof usuarios.$inferInsert;

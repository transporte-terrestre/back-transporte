import {
  pgEnum,
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const usuariosRol = pgEnum("usuarios_rol", ["empleado", "admin"]);

export const usuarios = pgTable(
  "usuarios",
  {
    id: serial("id").primaryKey(),
    nombres: varchar("nombres", { length: 100 }).notNull(),
    apellidos: varchar("apellidos", { length: 100 }).notNull(),
    nombreCompleto: varchar("nombre_completo", { length: 200 }).notNull(),
    email: varchar("email", { length: 100 }).notNull(),
    contrasenia: varchar("contrasenia", { length: 255 }).notNull(),
    roles: usuariosRol("roles").array().default(["empleado"]).notNull(),
    fotocheck: text("fotocheck").array().default([]),
    creadoEn: timestamp("creado_en").defaultNow().notNull(),
    actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
    eliminadoEn: timestamp("eliminado_en"),
  },
  (t) => [
    // Índices de búsqueda
    index("usuarios_nombre_completo_idx").using(
      "gin",
      t.nombreCompleto.op("gin_trgm_ops")
    ),
    index("usuarios_email_idx").on(t.email),
    // Índice único parcial - solo aplica cuando eliminadoEn IS NULL
    uniqueIndex("usuarios_email_unique_active_idx")
      .on(t.email)
      .where(sql`${t.eliminadoEn} IS NULL`),
  ]
);

export type UsuarioRol = (typeof usuariosRol.enumValues)[number];
export type Usuario = typeof usuarios.$inferSelect;
export type UsuarioDTO = typeof usuarios.$inferInsert;

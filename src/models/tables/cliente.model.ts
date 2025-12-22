import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const clientesTipoDocumento = pgEnum("clientes_tipo_documento", [
  "DNI",
  "RUC",
]);

export const clientes = pgTable(
  "clientes",
  {
    id: serial("id").primaryKey(),
    tipoDocumento: clientesTipoDocumento("tipo_documento")
      .default("DNI")
      .notNull(),
    dni: varchar("dni", { length: 20 }),
    ruc: varchar("ruc", { length: 20 }),
    nombres: varchar("nombres", { length: 100 }),
    apellidos: varchar("apellidos", { length: 100 }),
    razonSocial: varchar("razon_social", { length: 200 }),
    nombreCompleto: varchar("nombre_completo", { length: 200 }).notNull(),
    email: varchar("email", { length: 100 }),
    telefono: varchar("telefono", { length: 20 }),
    direccion: varchar("direccion", { length: 255 }),
    imagenes: text("imagenes").array().default([]),
    creadoEn: timestamp("creado_en").defaultNow().notNull(),
    actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
    eliminadoEn: timestamp("eliminado_en"),
  },
  (t) => [
    // Índices de búsqueda
    index("clientes_nombre_completo_idx").using(
      "gin",
      t.nombreCompleto.op("gin_trgm_ops")
    ),
    index("clientes_dni_idx").on(t.dni),
    index("clientes_ruc_idx").on(t.ruc),
    index("clientes_email_idx").on(t.email),
    index("clientes_telefono_idx").on(t.telefono),
    // Índices únicos parciales - solo aplican cuando eliminadoEn IS NULL
    uniqueIndex("clientes_dni_unique_active_idx")
      .on(t.dni)
      .where(sql`${t.eliminadoEn} IS NULL`),
    uniqueIndex("clientes_ruc_unique_active_idx")
      .on(t.ruc)
      .where(sql`${t.eliminadoEn} IS NULL`),
    uniqueIndex("clientes_email_unique_active_idx")
      .on(t.email)
      .where(sql`${t.eliminadoEn} IS NULL`),
  ]
);

export type ClienteTipoDocumento =
  (typeof clientesTipoDocumento.enumValues)[number];
export type Cliente = typeof clientes.$inferSelect;
export type ClienteDTO = typeof clientes.$inferInsert;

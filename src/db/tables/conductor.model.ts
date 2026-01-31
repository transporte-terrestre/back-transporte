import {
  pgTable,
  serial,
  varchar,
  timestamp,
  pgEnum,
  text,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const conductoresClaseLicencia = pgEnum("conductores_clase_licencia", [
  "A",
  "B",
]);

export const conductoresCategoriaLicencia = pgEnum(
  "conductores_categoria_licencia",
  ["Uno", "Dos", "Tres"]
);

export const conductores = pgTable(
  "conductores",
  {
    id: serial("id").primaryKey(),
    dni: varchar("dni", { length: 20 }).notNull(),
    nombres: varchar("nombres", { length: 100 }).notNull(),
    apellidos: varchar("apellidos", { length: 100 }).notNull(),
    nombreCompleto: varchar("nombre_completo", { length: 200 }).notNull(),
    email: varchar("email", { length: 150 }), // Optional for now to avoid migration issues with existing data without defaults
    celular: varchar("celular", { length: 20 }),
    numeroLicencia: varchar("numero_licencia", { length: 20 }).notNull(),
    claseLicencia: conductoresClaseLicencia("clase_licencia").notNull(),
    categoriaLicencia:
      conductoresCategoriaLicencia("categoria_licencia").notNull(),
    fotocheck: text("fotocheck").array().default([]),
    creadoEn: timestamp("creado_en").defaultNow().notNull(),
    actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
    eliminadoEn: timestamp("eliminado_en"),
  },
  (t) => [
    // Índices de búsqueda
    index("conductores_nombre_completo_idx").using(
      "gin",
      t.nombreCompleto.op("gin_trgm_ops")
    ),
    index("conductores_dni_idx").on(t.dni),
    index("conductores_numero_licencia_idx").on(t.numeroLicencia),
    // Índices únicos parciales - solo aplican cuando eliminadoEn IS NULL
    uniqueIndex("conductores_dni_unique_active_idx")
      .on(t.dni)
      .where(sql`${t.eliminadoEn} IS NULL`),
    uniqueIndex("conductores_numero_licencia_unique_active_idx")
      .on(t.numeroLicencia)
      .where(sql`${t.eliminadoEn} IS NULL`),
    uniqueIndex("conductores_email_unique_active_idx")
      .on(t.email)
      .where(sql`${t.eliminadoEn} IS NULL`),
    uniqueIndex("conductores_celular_unique_active_idx")
      .on(t.celular)
      .where(sql`${t.eliminadoEn} IS NULL`),
  ]
);

export type ConductorClaseLicencia =
  (typeof conductoresClaseLicencia.enumValues)[number];
export type ConductorCategoriaLicencia =
  (typeof conductoresCategoriaLicencia.enumValues)[number];
export type Conductor = typeof conductores.$inferSelect;
export type ConductorDTO = typeof conductores.$inferInsert;

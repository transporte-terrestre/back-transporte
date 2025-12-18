import {
  pgTable,
  serial,
  varchar,
  timestamp,
  pgEnum,
  text,
  index,
} from "drizzle-orm/pg-core";

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
    dni: varchar("dni", { length: 20 }).unique().notNull(),
    nombres: varchar("nombres", { length: 100 }).notNull(),
    apellidos: varchar("apellidos", { length: 100 }).notNull(),
    nombreCompleto: varchar("nombre_completo", { length: 200 }).notNull(),
    numeroLicencia: varchar("numero_licencia", { length: 20 })
      .unique()
      .notNull(),
    claseLicencia: conductoresClaseLicencia("clase_licencia").notNull(),
    categoriaLicencia:
      conductoresCategoriaLicencia("categoria_licencia").notNull(),
    fotocheck: text("fotocheck").array().default([]),
    creadoEn: timestamp("creado_en").defaultNow().notNull(),
    actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
    eliminadoEn: timestamp("eliminado_en"),
  },
  (t) => {
    return {
      nombreCompletoIndex: index("conductores_nombre_completo_idx").using(
        "gin",
        t.nombreCompleto.op("gin_trgm_ops")
      ),
      dniIndex: index("conductores_dni_idx").on(t.dni),
      numeroLicenciaIndex: index("conductores_numero_licencia_idx").on(
        t.numeroLicencia
      ),
    };
  }
);

export type ConductorClaseLicencia =
  (typeof conductoresClaseLicencia.enumValues)[number];
export type ConductorCategoriaLicencia =
  (typeof conductoresCategoriaLicencia.enumValues)[number];
export type Conductor = typeof conductores.$inferSelect;
export type ConductorDTO = typeof conductores.$inferInsert;

import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

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
    eliminadoEn: timestamp("eliminado_en"),
  },
  (t) => {
    return {
      nombreCompletoIndex: index("clientes_nombre_completo_idx").using(
        "gin",
        t.nombreCompleto.op("gin_trgm_ops")
      ),
      dniIndex: index("clientes_dni_idx").on(t.dni),
      rucIndex: index("clientes_ruc_idx").on(t.ruc),
      emailIndex: index("clientes_email_idx").on(t.email),
      telefonoIndex: index("clientes_telefono_idx").on(t.telefono),
    };
  }
);

export type ClienteTipoDocumento =
  (typeof clientesTipoDocumento.enumValues)[number];
export type Cliente = typeof clientes.$inferSelect;
export type ClienteDTO = typeof clientes.$inferInsert;

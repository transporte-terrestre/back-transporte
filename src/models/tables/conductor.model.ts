import { pgTable, serial, varchar, date, timestamp, pgEnum, text } from "drizzle-orm/pg-core";

export const claseLicenciaConductor = pgEnum("clase_licencia_conductor", [
  "A",
  "B",
]);

export const categoriaLicenciaConductor = pgEnum("categoria_licencia_conductor", [
  "Uno",
  "Dos",
  "Tres",
]);

export const conductores = pgTable("conductores", {
  id: serial("id").primaryKey(),
  dni: varchar("dni", { length: 20 }).unique().notNull(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  numeroLicencia: varchar("numero_licencia", { length: 20 }).unique().notNull(),
  claseLicencia: claseLicenciaConductor("clase_licencia").notNull(),
  categoriaLicencia: categoriaLicenciaConductor("categoria_licencia").notNull(),
  fechaExpedicion: date("fecha_expedicion").notNull(),
  fechaRevalidacion: date("fecha_revalidacion").notNull(),
  imagenes: text("imagenes").array().default([]),
  documentos: text("documentos").array().default([]),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export type Conductor = typeof conductores.$inferSelect;
export type ConductorDTO = typeof conductores.$inferInsert;

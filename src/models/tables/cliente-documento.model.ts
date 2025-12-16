import {
  pgTable,
  serial,
  pgEnum,
  date,
  timestamp,
  text,
  integer,
} from "drizzle-orm/pg-core";
import { clientes } from "./cliente.model";

export const clienteDocumentosTipo = pgEnum("cliente_documentos_tipo", [
  "dni",
  "ruc",
  "contrato",
  "carta_compromiso",
  "ficha_ruc",
  "otros",
]);

export const clienteDocumentos = pgTable("cliente_documentos", {
  id: serial("id").primaryKey(),
  clienteId: integer("cliente_id").notNull().references(() => clientes.id, { onDelete: "cascade" }),
  tipo: clienteDocumentosTipo("tipo").notNull(),
  nombre: text("nombre").notNull(),
  url: text("url").notNull(),
  fechaExpiracion: date("fecha_expiracion"),
  fechaEmision: date("fecha_emision"),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export type ClienteDocumentoTipo =
  (typeof clienteDocumentosTipo.enumValues)[number];
export type ClienteDocumento = typeof clienteDocumentos.$inferSelect;
export type ClienteDocumentoDTO = typeof clienteDocumentos.$inferInsert;

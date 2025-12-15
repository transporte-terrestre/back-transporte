import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { mantenimientos } from "./mantenimiento.model";

export const mantenimientoDocumentosTipo = pgEnum(
  "mantenimiento_documentos_tipo",
  [
    "factura",
    "guia_remision",
    "informe_tecnico",
    "cotizacion",
    "fotos",
    "otros",
  ]
);

export const mantenimientoDocumentos = pgTable("mantenimiento_documentos", {
  id: serial("id").primaryKey(),
  mantenimientoId: integer("mantenimiento_id").references(() => mantenimientos.id, { onDelete: "cascade" }).notNull(),
  tipo: mantenimientoDocumentosTipo("tipo").notNull(),
  url: text("url").notNull(),
  descripcion: varchar("descripcion", { length: 255 }),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export type MantenimientoDocumentoTipo = typeof mantenimientoDocumentosTipo.enumValues[number];
export type MantenimientoDocumento = typeof mantenimientoDocumentos.$inferSelect;
export type MantenimientoDocumentoDTO = typeof mantenimientoDocumentos.$inferInsert;

import { pgTable, serial, integer, timestamp, text, pgEnum } from "drizzle-orm/pg-core";
import { viajes } from "./viaje.model";
import { usuarios } from "./usuario.model";

export const viajeComentariosTipo = pgEnum("viaje_comentarios_tipo", [
  "observacion",
  "incidencia",
  "novedad",
  "general",
]);

export const viajeComentarios = pgTable("viaje_comentarios", {
  id: serial("id").primaryKey(),
  viajeId: integer("viaje_id").references(() => viajes.id, { onDelete: "cascade" }).notNull(),
  usuarioId: integer("usuario_id").references(() => usuarios.id, { onDelete: "cascade" }).notNull(),
  comentario: text("comentario").notNull(),
  tipo: viajeComentariosTipo("tipo").notNull(),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export type ViajeComentarioTipo = typeof viajeComentariosTipo.enumValues[number];
export type ViajeComentario = typeof viajeComentarios.$inferSelect;
export type ViajeComentarioDTO = typeof viajeComentarios.$inferInsert;

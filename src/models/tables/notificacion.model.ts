import {
  pgEnum,
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

export const notificacionTipo = pgEnum("notificacion_tipo", [
  "info",
  "warning",
  "error",
  "success",
]);

export const notificaciones = pgTable("notificaciones", {
  id: serial("id").primaryKey(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  mensaje: text("mensaje").notNull(),
  tipo: notificacionTipo("tipo").default("info").notNull(),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  eliminadoEn: timestamp("eliminado_en"),
});

export type NotificacionTipo = (typeof notificacionTipo.enumValues)[number];
export type Notificacion = typeof notificaciones.$inferSelect;
export type NotificacionDTO = typeof notificaciones.$inferInsert;

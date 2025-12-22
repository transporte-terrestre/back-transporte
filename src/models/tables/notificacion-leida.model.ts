import {
  pgTable,
  serial,
  integer,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { usuarios } from "./usuario.model";
import { notificaciones } from "./notificacion.model";

export const notificacionesLeidas = pgTable(
  "notificaciones_leidas",
  {
    id: serial("id").primaryKey(),
    usuarioId: integer("usuario_id")
      .references(() => usuarios.id)
      .notNull(),
    notificacionId: integer("notificacion_id")
      .references(() => notificaciones.id)
      .notNull(),
    leidoEn: timestamp("leido_en").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("usuario_notificacion_unique_idx").on(
      t.usuarioId,
      t.notificacionId
    ),
  ]
);

export type NotificacionLeida = typeof notificacionesLeidas.$inferSelect;
export type NotificacionLeidaDTO = typeof notificacionesLeidas.$inferInsert;

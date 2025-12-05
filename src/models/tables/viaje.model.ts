import {
  pgTable,
  serial,
  integer,
  timestamp,
  pgEnum
} from "drizzle-orm/pg-core";
import { rutas } from "./ruta.model";
import { vehiculos } from "./vehiculo.model";
import { conductores } from "./conductor.model";

export const estadoViaje = pgEnum("estado_viaje", [
  "programado",
  "en_progreso",
  "completado",
  "cancelado",
]);

export const viajes = pgTable("viajes", {
  id: serial("id").primaryKey(),
  rutaId: integer("ruta_id").references(() => rutas.id).notNull(),
  vehiculoId: integer("vehiculo_id").references(() => vehiculos.id).notNull(),
  conductorId: integer("conductor_id").references(() => conductores.id).notNull(),
  fechaSalida: timestamp("fecha_salida").notNull(),
  fechaLlegada: timestamp("fecha_llegada"),
  estado: estadoViaje("estado").default("programado").notNull(),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export type Viaje = typeof viajes.$inferSelect;
export type ViajeDTO = typeof viajes.$inferInsert;

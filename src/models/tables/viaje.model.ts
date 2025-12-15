import {
  pgTable,
  serial,
  integer,
  timestamp,
  pgEnum,
  varchar,
  boolean,
  text,
} from "drizzle-orm/pg-core";
import { rutas } from "./ruta.model";
import { clientes } from "./cliente.model";

export const viajesEstado = pgEnum("viajes_estado", [
  "programado",
  "en_progreso",
  "completado",
  "cancelado",
]);

export const modalidadServicio = pgEnum("viajes_modalidad_servicio", [
  "regular",
  "expreso",
  "ejecutivo",
  "especial",
  "turismo",
]);

export const viajesTipoRuta = pgEnum("viajes_tipo_ruta", [
    "ocasional", 
    "fija"
]);

export const viajes = pgTable("viajes", {
  id: serial("id").primaryKey(),
  rutaId: integer("ruta_id").references(() => rutas.id),
  rutaOcasional: varchar("ruta_ocasional", { length: 500 }),
  tipoRuta: viajesTipoRuta("tipo_ruta").default("fija").notNull(),
  clienteId: integer("cliente_id").references(() => clientes.id).notNull(),
  tripulantes: text("tripulantes").array(),
  modalidadServicio: modalidadServicio("modalidad_servicio").default("regular").notNull(),
  estado: viajesEstado("estado").default("programado").notNull(),
  fechaSalida: timestamp("fecha_salida").notNull(),
  fechaLlegada: timestamp("fecha_llegada"),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
});

export type ViajeEstado = typeof viajesEstado.enumValues[number];
export type ViajeTipoRuta = typeof viajesTipoRuta.enumValues[number];
export type ViajeModalidadServicio = typeof modalidadServicio.enumValues[number];
export type Viaje = typeof viajes.$inferSelect;
export type ViajeDTO = typeof viajes.$inferInsert;

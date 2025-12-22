import {
  pgTable,
  serial,
  varchar,
  integer,
  decimal,
  timestamp,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { vehiculos } from "./vehiculo.model";
import { talleres } from "./taller.model";
import { pgEnum } from "drizzle-orm/pg-core";

export const mantenimientosTipo = pgEnum("mantenimientos_tipo", [
  "preventivo",
  "correctivo",
]);

export const mantenimientosEstado = pgEnum("mantenimientos_estado", [
  "pendiente",
  "en_proceso",
  "finalizado",
]);

export const mantenimientos = pgTable(
  "mantenimientos",
  {
    id: serial("id").primaryKey(),
    vehiculoId: integer("vehiculo_id")
      .references(() => vehiculos.id)
      .notNull(),
    tallerId: integer("taller_id")
      .references(() => talleres.id)
      .notNull(),
    codigoOrden: varchar("codigo_orden", { length: 50 }),
    tipo: mantenimientosTipo("tipo").notNull(),
    costoTotal: decimal("costo_total", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    descripcion: text("descripcion").notNull(),
    fechaIngreso: timestamp("fecha_ingreso").notNull(),
    fechaSalida: timestamp("fecha_salida"),
    kilometraje: integer("kilometraje").notNull(),
    estado: mantenimientosEstado("estado").default("pendiente").notNull(),
    creadoEn: timestamp("creado_en").defaultNow().notNull(),
    actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
    eliminadoEn: timestamp("eliminado_en"),
  },
  (t) => [
    // Índice único parcial - solo aplica cuando eliminadoEn IS NULL
    uniqueIndex("mantenimientos_codigo_orden_unique_active_idx")
      .on(t.codigoOrden)
      .where(sql`${t.eliminadoEn} IS NULL`),
  ]
);

export type MantenimientoTipo = (typeof mantenimientosTipo.enumValues)[number];
export type MantenimientoEstado =
  (typeof mantenimientosEstado.enumValues)[number];
export type Mantenimiento = typeof mantenimientos.$inferSelect;
export type MantenimientoDTO = typeof mantenimientos.$inferInsert;

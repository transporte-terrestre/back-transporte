import {
  pgEnum,
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  text,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { modelos } from "./modelo.model";

export const vehiculosEstado = pgEnum("vehiculos_estado", [
  "activo",
  "taller",
  "retirado",
]);

export const vehiculos = pgTable(
  "vehiculos",
  {
    id: serial("id").primaryKey(),
    placa: varchar("placa", { length: 20 }).notNull(),
    codigoInterno: varchar("codigo_interno", { length: 50 }),
    modeloId: integer("modelo_id")
      .notNull()
      .references(() => modelos.id, { onDelete: "restrict" }),
    anio: integer("anio").notNull(),
    kilometraje: integer("kilometraje").default(0).notNull(),
    estado: vehiculosEstado("estado").default("activo").notNull(),
    imagenes: text("imagenes").array().default([]),
    creadoEn: timestamp("creado_en").defaultNow().notNull(),
    actualizadoEn: timestamp("actualizado_en").defaultNow().notNull(),
    eliminadoEn: timestamp("eliminado_en"),
  },
  (t) => [
    // Índices de búsqueda
    index("vehiculos_modelo_id_idx").on(t.modeloId),
    index("vehiculos_placa_idx").using("gin", t.placa.op("gin_trgm_ops")),
    index("vehiculos_codigo_interno_idx").on(t.codigoInterno),
    // Índices únicos parciales - solo aplican cuando eliminadoEn IS NULL
    uniqueIndex("vehiculos_placa_unique_active_idx")
      .on(t.placa)
      .where(sql`${t.eliminadoEn} IS NULL`),
    uniqueIndex("vehiculos_codigo_interno_unique_active_idx")
      .on(t.codigoInterno)
      .where(sql`${t.eliminadoEn} IS NULL`),
  ]
);

export type VehiculoEstado = (typeof vehiculosEstado.enumValues)[number];
export type Vehiculo = typeof vehiculos.$inferSelect;
export type VehiculoDTO = typeof vehiculos.$inferInsert;

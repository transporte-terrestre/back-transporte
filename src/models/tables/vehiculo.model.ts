import {
  pgEnum,
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  text,
  index,
} from "drizzle-orm/pg-core";
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
    placa: varchar("placa", { length: 20 }).unique().notNull(),
    codigoInterno: varchar("codigo_interno", { length: 50 }).unique(),
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
  (t) => {
    return {
      modeloIdIndex: index("vehiculos_modelo_id_idx").on(t.modeloId),
      placaIndex: index("vehiculos_placa_idx").using(
        "gin",
        t.placa.op("gin_trgm_ops")
      ),
      codigoInternoIndex: index("vehiculos_codigo_interno_idx").on(
        t.codigoInterno
      ),
    };
  }
);

export type VehiculoEstado = (typeof vehiculosEstado.enumValues)[number];
export type Vehiculo = typeof vehiculos.$inferSelect;
export type VehiculoDTO = typeof vehiculos.$inferInsert;

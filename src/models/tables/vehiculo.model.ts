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
    marca: varchar("marca", { length: 50 }).notNull(),
    modelo: varchar("modelo", { length: 50 }).notNull(),
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
      marcaIndex: index("vehiculos_marca_idx").using(
        "gin",
        t.marca.op("gin_trgm_ops")
      ),
      modeloIndex: index("vehiculos_modelo_idx").using(
        "gin",
        t.modelo.op("gin_trgm_ops")
      ),
      placaIndex: index("vehiculos_placa_idx").on(t.placa),
      codigoInternoIndex: index("vehiculos_codigo_interno_idx").on(
        t.codigoInterno
      ),
    };
  }
);

export type VehiculoEstado = (typeof vehiculosEstado.enumValues)[number];
export type Vehiculo = typeof vehiculos.$inferSelect;
export type VehiculoDTO = typeof vehiculos.$inferInsert;

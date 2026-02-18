import { pgTable, serial, varchar, timestamp, text, pgEnum, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const proveedoresTipoDocumento = pgEnum('proveedores_tipo_documento', ['DNI', 'RUC']);

export const proveedores = pgTable(
  'proveedores',
  {
    id: serial('id').primaryKey(),
    tipoDocumento: proveedoresTipoDocumento('tipo_documento').default('DNI').notNull(),
    dni: varchar('dni', { length: 20 }),
    ruc: varchar('ruc', { length: 20 }),
    nombres: varchar('nombres', { length: 100 }),
    apellidos: varchar('apellidos', { length: 100 }),
    razonSocial: varchar('razon_social', { length: 200 }),
    nombreCompleto: varchar('nombre_completo', { length: 200 }).notNull(),
    email: varchar('email', { length: 100 }),
    telefono: varchar('telefono', { length: 20 }),
    direccion: varchar('direccion', { length: 255 }),
    imagenes: text('imagenes').array().default([]),
    creadoEn: timestamp('creado_en').defaultNow().notNull(),
    actualizadoEn: timestamp('actualizado_en').defaultNow().notNull(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => [
    index('proveedores_nombre_completo_idx').using('gin', t.nombreCompleto.op('gin_trgm_ops')),
    index('proveedores_dni_idx').on(t.dni),
    index('proveedores_ruc_idx').on(t.ruc),
    index('proveedores_email_idx').on(t.email),
    index('proveedores_telefono_idx').on(t.telefono),
    uniqueIndex('proveedores_dni_unique_active_idx')
      .on(t.dni)
      .where(sql`${t.eliminadoEn} IS NULL`),
    uniqueIndex('proveedores_ruc_unique_active_idx')
      .on(t.ruc)
      .where(sql`${t.eliminadoEn} IS NULL`),
    uniqueIndex('proveedores_email_unique_active_idx')
      .on(t.email)
      .where(sql`${t.eliminadoEn} IS NULL`),
  ],
);

export type ProveedorTipoDocumento = (typeof proveedoresTipoDocumento.enumValues)[number];
export type Proveedor = typeof proveedores.$inferSelect;
export type ProveedorDTO = typeof proveedores.$inferInsert;

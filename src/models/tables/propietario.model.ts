import { pgTable, serial, varchar, timestamp, text, pgEnum, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const propietariosTipoDocumento = pgEnum('propietarios_tipo_documento', ['DNI', 'RUC']);

export const propietarios = pgTable(
  'propietarios',
  {
    id: serial('id').primaryKey(),
    tipoDocumento: propietariosTipoDocumento('tipo_documento').default('DNI').notNull(),
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
    index('propietarios_nombre_completo_idx').using('gin', t.nombreCompleto.op('gin_trgm_ops')),
    index('propietarios_dni_idx').on(t.dni),
    index('propietarios_ruc_idx').on(t.ruc),
    index('propietarios_email_idx').on(t.email),
    index('propietarios_telefono_idx').on(t.telefono),
    uniqueIndex('propietarios_dni_unique_active_idx')
      .on(t.dni)
      .where(sql`${t.eliminadoEn} IS NULL`),
    uniqueIndex('propietarios_ruc_unique_active_idx')
      .on(t.ruc)
      .where(sql`${t.eliminadoEn} IS NULL`),
    uniqueIndex('propietarios_email_unique_active_idx')
      .on(t.email)
      .where(sql`${t.eliminadoEn} IS NULL`),
  ],
);

export type PropietarioTipoDocumento = (typeof propietariosTipoDocumento.enumValues)[number];
export type Propietario = typeof propietarios.$inferSelect;
export type PropietarioDTO = typeof propietarios.$inferInsert;

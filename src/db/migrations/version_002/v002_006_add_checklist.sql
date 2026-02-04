-- Migración: Crear tablas de checklist para viajes (Consolidada)
-- Fecha: 2026-01-31
-- Descripción: Consolida v002_005, v002_006 y v002_007

-- Enum para sección del item
CREATE TYPE "checklist_item_seccion" AS ENUM('conductor', 'supervision');

-- Enum para tipo de checklist
CREATE TYPE "viaje_checklist_tipo" AS ENUM('salida', 'llegada');

-- Tabla: Catálogo de items del checklist
CREATE TABLE "checklist_items" (
  "id" SERIAL PRIMARY KEY,
  "seccion" "checklist_item_seccion" NOT NULL,
  "nombre" VARCHAR(100) NOT NULL,
  "descripcion" VARCHAR(200),
  "icono" VARCHAR(50),
  "orden" INTEGER DEFAULT 1 NOT NULL,
  "activo" BOOLEAN DEFAULT TRUE NOT NULL,
  "creado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
  "actualizado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
  "eliminado_en" TIMESTAMP
);

CREATE INDEX "checklist_items_seccion_idx" ON "checklist_items" ("seccion");
CREATE INDEX "checklist_items_orden_idx" ON "checklist_items" ("seccion", "orden");

-- Tabla: Checklists por viaje (salida/llegada)
CREATE TABLE "viaje_checklists" (
  "id" SERIAL PRIMARY KEY,
  "viaje_id" INTEGER NOT NULL REFERENCES "viajes"("id") ON DELETE CASCADE,
  "tipo" "viaje_checklist_tipo" NOT NULL,
  "validado_por" INTEGER REFERENCES "usuarios"("id"),
  "validado_en" TIMESTAMP,
  "observaciones" TEXT,
  "creado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
  "actualizado_en" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX "viaje_checklists_viaje_id_idx" ON "viaje_checklists" ("viaje_id");
CREATE UNIQUE INDEX "viaje_checklists_viaje_tipo_unique_idx" ON "viaje_checklists" ("viaje_id", "tipo");

-- Tabla: Items marcados en cada checklist (PK compuesta)
CREATE TABLE "viaje_checklist_items" (
  "viaje_checklist_id" INTEGER NOT NULL REFERENCES "viaje_checklists"("id") ON DELETE CASCADE,
  "checklist_item_id" INTEGER NOT NULL REFERENCES "checklist_items"("id"),
  "completado" BOOLEAN DEFAULT FALSE NOT NULL,
  "observacion" TEXT,
  "creado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
  "actualizado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
  PRIMARY KEY ("viaje_checklist_id", "checklist_item_id")
);

CREATE INDEX "viaje_checklist_items_checklist_id_idx" ON "viaje_checklist_items" ("viaje_checklist_id");

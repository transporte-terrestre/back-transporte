-- Migración: Refactorizar viaje_checklist_items para usar PK compuesta
-- Fecha: 2026-01-31
-- Descripción: Elimina el ID serial y usa (viaje_checklist_id, checklist_item_id) como PK compuesta

-- 1. Eliminar la tabla existente con sus datos
DROP TABLE IF EXISTS "viaje_checklist_items" CASCADE;

-- 2. Recrear la tabla con PK compuesta
CREATE TABLE "viaje_checklist_items" (
  "viaje_checklist_id" INTEGER NOT NULL REFERENCES "viaje_checklists"("id") ON DELETE CASCADE,
  "checklist_item_id" INTEGER NOT NULL REFERENCES "checklist_items"("id"),
  "completado" BOOLEAN DEFAULT FALSE NOT NULL,
  "observacion" TEXT,
  "creado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
  "actualizado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
  PRIMARY KEY ("viaje_checklist_id", "checklist_item_id")
);

-- Índice para búsquedas por checklist
CREATE INDEX "viaje_checklist_items_checklist_id_idx" ON "viaje_checklist_items" ("viaje_checklist_id");

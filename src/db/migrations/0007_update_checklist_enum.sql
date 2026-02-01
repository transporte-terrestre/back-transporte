-- Agregar valor 'llegada' al enum
ALTER TYPE "viaje_checklist_tipo" ADD VALUE 'llegada';

-- Opcional: Si queremos migrar datos existentes (no podemos borrar 'entrada' fácilmente del enum sin recrearlo)
-- UPDATE "viaje_checklists" SET "tipo" = 'llegada' WHERE "tipo"::text = 'entrada';

-- Migración Consolidada v002_005: Mantenimiento
-- Incluye: Kilometraje próximo mantenimiento

ALTER TABLE "mantenimientos" ADD COLUMN "kilometraje_proximo_mantenimiento" integer;

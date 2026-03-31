-- Migración: Eliminar índice único parcial de codigo_orden en mantenimientos
-- Motivo: Permite crear múltiples mantenimientos con el mismo código de orden activo

DROP INDEX IF EXISTS mantenimientos_codigo_orden_unique_active_idx;

-- Migración: Cambiar campos de kilometraje a numeric(10,2) para aceptar decimales

ALTER TABLE mantenimientos ALTER COLUMN kilometraje TYPE numeric(10,2);
ALTER TABLE mantenimientos ALTER COLUMN kilometraje_proximo_mantenimiento TYPE numeric(10,2);

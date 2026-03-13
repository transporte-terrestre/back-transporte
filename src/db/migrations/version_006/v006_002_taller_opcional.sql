-- Hacer taller_id opcional en la tabla mantenimientos
ALTER TABLE mantenimientos ALTER COLUMN taller_id DROP NOT NULL;

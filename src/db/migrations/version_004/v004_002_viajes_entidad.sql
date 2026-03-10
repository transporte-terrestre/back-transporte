-- Migración: Agregar entidad_id a la tabla de viajes
-- Permite asociar un viaje con una entidad específica de un cliente

ALTER TABLE viajes ADD COLUMN IF NOT EXISTS entidad_id INTEGER REFERENCES entidades(id) ON DELETE SET NULL;

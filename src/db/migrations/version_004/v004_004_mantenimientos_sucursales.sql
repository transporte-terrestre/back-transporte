-- Migración: Agregar sucursal_id a la tabla mantenimientos

ALTER TABLE mantenimientos ADD COLUMN IF NOT EXISTS sucursal_id INTEGER REFERENCES sucursales(id);

-- Migración: Agregar columna empresa a la tabla viaje_pasajeros
ALTER TABLE viaje_pasajeros ADD COLUMN empresa VARCHAR(255);

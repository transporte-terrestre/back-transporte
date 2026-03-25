-- Migration: Add nombre_ruta to viajes table
ALTER TABLE viajes ADD COLUMN nombre_ruta VARCHAR(500);

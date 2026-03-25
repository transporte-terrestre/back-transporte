-- v008_002_viajes_encargado_id.sql
ALTER TABLE viajes ADD COLUMN encargado_id INTEGER REFERENCES encargados(id);

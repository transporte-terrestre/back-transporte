-- Renombrar columnas de paradas en viaje_servicios
ALTER TABLE viaje_servicios RENAME COLUMN parada_partida_ocasional TO parada_partida_nombre;
ALTER TABLE viaje_servicios RENAME COLUMN parada_llegada_ocasional TO parada_llegada_nombre;

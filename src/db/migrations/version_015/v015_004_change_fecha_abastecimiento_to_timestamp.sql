-- Permite registrar la fecha y hora exactas de abastecimientos independientes.
-- Las fechas históricas se conservan a las 00:00:00 de Lima (UTC-5).

ALTER TABLE vehiculo_abastecimientos
  ALTER COLUMN fecha_abastecimiento TYPE TIMESTAMP
  USING fecha_abastecimiento::timestamp + INTERVAL '5 hours';

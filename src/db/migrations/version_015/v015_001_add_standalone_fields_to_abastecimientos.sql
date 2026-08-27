ALTER TABLE vehiculo_abastecimientos
  ADD COLUMN IF NOT EXISTS kilometraje_suelto NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS tramo_suelto TEXT,
  ADD COLUMN IF NOT EXISTS fecha_abastecimiento DATE,
  ADD COLUMN IF NOT EXISTS metadata JSONB;

CREATE INDEX IF NOT EXISTS vehiculo_abastecimientos_fecha_abastecimiento_idx
  ON vehiculo_abastecimientos(fecha_abastecimiento);

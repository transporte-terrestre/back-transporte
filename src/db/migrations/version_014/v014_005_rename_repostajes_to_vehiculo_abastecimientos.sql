ALTER TABLE IF EXISTS viaje_repostaje_movimientos RENAME TO vehiculo_abastecimientos;

ALTER INDEX IF EXISTS viaje_repostaje_movimientos_viaje_tramo_id_idx RENAME TO vehiculo_abastecimientos_viaje_tramo_id_idx;

ALTER TABLE vehiculo_abastecimientos ADD COLUMN IF NOT EXISTS vehiculo_id INTEGER;

UPDATE vehiculo_abastecimientos abastecimiento
SET vehiculo_id = vehiculo_viaje.vehiculo_id
FROM viaje_tramos tramo
JOIN LATERAL (
  SELECT viaje_vehiculos.vehiculo_id
  FROM viaje_vehiculos
  WHERE viaje_vehiculos.viaje_id = tramo.viaje_id
  ORDER BY viaje_vehiculos.es_principal DESC, viaje_vehiculos.vehiculo_id ASC
  LIMIT 1
) vehiculo_viaje ON TRUE
WHERE abastecimiento.viaje_tramo_id = tramo.id
  AND abastecimiento.vehiculo_id IS NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM vehiculo_abastecimientos
    WHERE vehiculo_id IS NULL
  ) THEN
    RAISE EXCEPTION 'No se pudo poblar vehiculo_id para todos los abastecimientos existentes.';
  END IF;
END $$;

ALTER TABLE vehiculo_abastecimientos ALTER COLUMN vehiculo_id SET NOT NULL;
ALTER TABLE vehiculo_abastecimientos ALTER COLUMN viaje_tramo_id DROP NOT NULL;

DO $$
DECLARE
  constraint_name text;
BEGIN
  SELECT tc.constraint_name
  INTO constraint_name
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
   AND tc.table_schema = kcu.table_schema
  WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'vehiculo_abastecimientos'
    AND kcu.column_name = 'viaje_tramo_id'
  LIMIT 1;

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE vehiculo_abastecimientos DROP CONSTRAINT %I', constraint_name);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'vehiculo_abastecimientos_viaje_tramo_id_fk'
      AND table_name = 'vehiculo_abastecimientos'
  ) THEN
    ALTER TABLE vehiculo_abastecimientos
      ADD CONSTRAINT vehiculo_abastecimientos_viaje_tramo_id_fk
      FOREIGN KEY (viaje_tramo_id) REFERENCES viaje_tramos(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'vehiculo_abastecimientos_vehiculo_id_fk'
      AND table_name = 'vehiculo_abastecimientos'
  ) THEN
    ALTER TABLE vehiculo_abastecimientos
      ADD CONSTRAINT vehiculo_abastecimientos_vehiculo_id_fk
      FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS vehiculo_abastecimientos_vehiculo_id_idx ON vehiculo_abastecimientos(vehiculo_id);

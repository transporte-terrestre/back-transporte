-- Agrega moneda a las tarifas y montos de los alquileres.
-- Los registros históricos y los clientes que aún no envían moneda usan PEN.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alquiler_moneda') THEN
    CREATE TYPE alquiler_moneda AS ENUM ('PEN', 'USD');
  END IF;
END
$$;

ALTER TABLE alquileres
  ADD COLUMN IF NOT EXISTS moneda alquiler_moneda;

UPDATE alquileres
SET moneda = 'PEN'
WHERE moneda IS NULL;

ALTER TABLE alquileres
  ALTER COLUMN moneda SET DEFAULT 'PEN',
  ALTER COLUMN moneda SET NOT NULL;

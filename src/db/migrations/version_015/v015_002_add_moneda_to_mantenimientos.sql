-- Agrega moneda al costo total de los mantenimientos.
-- Los registros históricos y los clientes que aún no envían moneda usan PEN.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mantenimientos_moneda') THEN
    CREATE TYPE mantenimientos_moneda AS ENUM ('PEN', 'USD');
  END IF;
END
$$;

ALTER TABLE mantenimientos
  ADD COLUMN IF NOT EXISTS moneda mantenimientos_moneda;

UPDATE mantenimientos
SET moneda = 'PEN'
WHERE moneda IS NULL;

ALTER TABLE mantenimientos
  ALTER COLUMN moneda SET DEFAULT 'PEN',
  ALTER COLUMN moneda SET NOT NULL;

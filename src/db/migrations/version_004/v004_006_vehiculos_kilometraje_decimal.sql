-- Permite kilometraje con decimales (ej. 8.5) para evitar errores al registrar tramos.
ALTER TABLE vehiculos
ALTER COLUMN kilometraje TYPE NUMERIC(12, 2)
USING kilometraje::NUMERIC(12, 2);

-- Mantiene default compatible con el nuevo tipo decimal.
ALTER TABLE vehiculos
ALTER COLUMN kilometraje SET DEFAULT 0.00;

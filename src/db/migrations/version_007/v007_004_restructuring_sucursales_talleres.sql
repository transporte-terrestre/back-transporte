-- 1. Add taller_id and ubicacion_exacta to sucursales
ALTER TABLE sucursales ADD COLUMN taller_id INTEGER;
ALTER TABLE sucursales ADD COLUMN ubicacion_exacta VARCHAR(255);

-- 2. Add foreign key constraint
ALTER TABLE sucursales ADD CONSTRAINT fk_sucursales_talleres FOREIGN KEY (taller_id) REFERENCES talleres(id) ON DELETE CASCADE;

-- 3. Migrate existing relationships from taller_sucursales to sucursales if possible
-- We take the first relationship found for each sucursal from the old junction table
DO $$ 
BEGIN 
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'taller_sucursales') THEN
        UPDATE sucursales s
        SET taller_id = ts.taller_id,
            ubicacion_exacta = ts.direccion
        FROM taller_sucursales ts
        WHERE s.id = ts.sucursal_id;
    END IF;
END $$;

-- 4. Drop departamento and provincia columns from sucursales
ALTER TABLE sucursales DROP COLUMN departamento;
ALTER TABLE sucursales DROP COLUMN provincia;

-- 5. Drop the junction table taller_sucursales
DROP TABLE IF EXISTS taller_sucursales;

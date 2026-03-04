-- Migration para convertir 'sucursales' a ubicacion y añadir 'direccion' a 'taller_sucursales'

-- 1. Añadir campos temporales en lugar de 'nombre' y 'direccion' en sucursales
ALTER TABLE "sucursales" 
  ADD COLUMN IF NOT EXISTS "departamento" varchar(100) DEFAULT 'Desconocido' NOT NULL,
  ADD COLUMN IF NOT EXISTS "provincia" varchar(100) DEFAULT 'Desconocido' NOT NULL,
  ADD COLUMN IF NOT EXISTS "distrito" varchar(100) DEFAULT 'Desconocido' NOT NULL;

-- Para preservar los indices Gin, primero los eliminamos si existen de 'nombre'
DROP INDEX IF EXISTS "sucursales_nombre_idx";

-- Drop de las antiguas columnas en sucursal (ahora se usarán departamento, provincia, distrito)
ALTER TABLE "sucursales" 
  DROP COLUMN IF EXISTS "nombre",
  DROP COLUMN IF EXISTS "direccion";

-- Creamos los nuevos indices sobre las nuevas columnas
CREATE INDEX IF NOT EXISTS "sucursales_departamento_idx" ON "sucursales" USING gin ("departamento" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "sucursales_provincia_idx" ON "sucursales" USING gin ("provincia" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "sucursales_distrito_idx" ON "sucursales" USING gin ("distrito" gin_trgm_ops);

-- 2. Añadir campo de 'direccion' dentro de la tabla pivote de 'taller_sucursales'
ALTER TABLE "taller_sucursales" 
  ADD COLUMN IF NOT EXISTS "direccion" varchar(255) DEFAULT 'Sin dirección' NOT NULL;

-- 3. Eliminar campo de 'direccion' dentro de 'talleres' (si ya no será relevante, pues estará en taller_sucursales)
ALTER TABLE "talleres" 
  DROP COLUMN IF EXISTS "direccion";

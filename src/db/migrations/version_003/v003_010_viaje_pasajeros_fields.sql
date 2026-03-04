-- Migración v003_010: Campos extra para viaje_pasajeros y pasajero_id nullable
-- Permite manejar pasajeros ad-hoc o cargados desde Excel

-- 1. Eliminar la llave primaria compuesta
ALTER TABLE "viaje_pasajeros" DROP CONSTRAINT IF EXISTS "viaje_pasajeros_viaje_id_pasajero_id_pk";

-- 2. Agregar columna id serial como nueva llave primaria
ALTER TABLE "viaje_pasajeros" ADD COLUMN "id" serial PRIMARY KEY;

-- 3. Hacer que pasajero_id sea nullable
ALTER TABLE "viaje_pasajeros" ALTER COLUMN "pasajero_id" DROP NOT NULL;

-- 4. Agregar campos extra para pasajeros ad-hoc
ALTER TABLE "viaje_pasajeros" ADD COLUMN "dni" varchar(20);
ALTER TABLE "viaje_pasajeros" ADD COLUMN "nombres" varchar(200);
ALTER TABLE "viaje_pasajeros" ADD COLUMN "apellidos" varchar(200);

-- 5. Agregar índices de unicidad para permitir onConflict
CREATE UNIQUE INDEX IF NOT EXISTS "viaje_pasajeros_viaje_id_pasajero_id_unique_idx" ON "viaje_pasajeros" ("viaje_id", "pasajero_id");
CREATE UNIQUE INDEX IF NOT EXISTS "viaje_pasajeros_viaje_id_dni_unique_idx" ON "viaje_pasajeros" ("viaje_id", "dni");

-- 6. Agregar índice para búsqueda por DNI
CREATE INDEX IF NOT EXISTS "viaje_pasajeros_dni_idx" ON "viaje_pasajeros" ("dni");

-- migration.sql
-- Add scheduled date columns with default value for the starting one
ALTER TABLE "viajes" ADD COLUMN "fecha_salida_programada" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "viajes" ADD COLUMN "fecha_llegada_programada" timestamp;

-- Drop NOT NULL constraint on fecha_salida as it will now be the real departure date
ALTER TABLE "viajes" ALTER COLUMN "fecha_salida" DROP NOT NULL;

-- Migración Consolidada v002_001: Actualizaciones del núcleo y usuarios
-- Incluye: Contraseña de conductores, Turno/Vale en Viajes, Sentido en Viajes

-- 1. Contraseña conductores
ALTER TABLE "conductores" ADD COLUMN "contrasenia" varchar(255);

-- 2. Turno y Vale en Viajes
DO $$ BEGIN
    CREATE TYPE "viajes_turno" AS ENUM('dia', 'noche');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "viajes" ADD COLUMN "turno" "viajes_turno";
ALTER TABLE "viajes" ADD COLUMN "numero_vale" VARCHAR(50);

-- 3. Sentido en Viajes
DO $$ BEGIN
    CREATE TYPE "viajes_sentido" AS ENUM ('ida', 'vuelta');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "viajes" ADD COLUMN IF NOT EXISTS "sentido" "viajes_sentido" DEFAULT 'ida' NOT NULL;

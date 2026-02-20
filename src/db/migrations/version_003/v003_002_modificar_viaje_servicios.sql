-- Crear tipo ENUM
DO $$ BEGIN
    CREATE TYPE "tipo_servicio" AS ENUM ('trayecto', 'descanso');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Agregar nuevas columnas
ALTER TABLE "viaje_servicios" ADD COLUMN "tipo" "tipo_servicio" DEFAULT 'trayecto' NOT NULL;
ALTER TABLE "viaje_servicios" ADD COLUMN "longitud" double precision;
ALTER TABLE "viaje_servicios" ADD COLUMN "latitud" double precision;
ALTER TABLE "viaje_servicios" ADD COLUMN "nombre_lugar" text;
ALTER TABLE "viaje_servicios" ADD COLUMN "hora_final" timestamp;
ALTER TABLE "viaje_servicios" ADD COLUMN "kilometraje_final" double precision;

-- Eliminar columnas antiguas
ALTER TABLE "viaje_servicios" DROP COLUMN IF EXISTS "parada_partida_nombre";
ALTER TABLE "viaje_servicios" DROP COLUMN IF EXISTS "parada_llegada_nombre";
ALTER TABLE "viaje_servicios" DROP COLUMN IF EXISTS "hora_salida";
ALTER TABLE "viaje_servicios" DROP COLUMN IF EXISTS "hora_termino";
ALTER TABLE "viaje_servicios" DROP COLUMN IF EXISTS "km_inicial";
ALTER TABLE "viaje_servicios" DROP COLUMN IF EXISTS "km_final";

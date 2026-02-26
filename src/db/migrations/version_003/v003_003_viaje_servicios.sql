-- 3. Modificar viaje_servicios (Capa de registros del conductor)

-- Definición de tipos ENUM
DO $$ BEGIN
    CREATE TYPE "tipo_servicio" AS ENUM ('origen', 'punto', 'parada', 'descanso', 'destino', 'trayecto');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Limpieza de columnas antiguas
ALTER TABLE "viaje_servicios" DROP COLUMN IF EXISTS "parada_partida_id";
ALTER TABLE "viaje_servicios" DROP COLUMN IF EXISTS "parada_llegada_id";
ALTER TABLE "viaje_servicios" DROP COLUMN IF EXISTS "parada_partida_nombre";
ALTER TABLE "viaje_servicios" DROP COLUMN IF EXISTS "parada_llegada_nombre";
ALTER TABLE "viaje_servicios" DROP COLUMN IF EXISTS "hora_salida";
ALTER TABLE "viaje_servicios" DROP COLUMN IF EXISTS "hora_termino";
ALTER TABLE "viaje_servicios" DROP COLUMN IF EXISTS "km_inicial";
ALTER TABLE "viaje_servicios" DROP COLUMN IF EXISTS "km_final";
ALTER TABLE "viaje_servicios" DROP COLUMN IF EXISTS "observaciones";
ALTER TABLE "viaje_servicios" DROP COLUMN IF EXISTS "orden";

-- Agregar nuevas columnas
ALTER TABLE "viaje_servicios" ADD COLUMN "tipo" "tipo_servicio" DEFAULT 'punto' NOT NULL;
ALTER TABLE "viaje_servicios" ADD COLUMN "longitud" double precision;
ALTER TABLE "viaje_servicios" ADD COLUMN "latitud" double precision;
ALTER TABLE "viaje_servicios" ADD COLUMN "nombre_lugar" text;
ALTER TABLE "viaje_servicios" ADD COLUMN "hora_final" timestamp;
ALTER TABLE "viaje_servicios" ADD COLUMN "kilometraje_final" double precision;
ALTER TABLE "viaje_servicios" ADD COLUMN "ruta_parada_id" INTEGER REFERENCES "ruta_paradas"("id") ON DELETE SET NULL;
ALTER TABLE "viaje_servicios" ADD COLUMN "eliminado_en" TIMESTAMP;

-- Índices
CREATE INDEX IF NOT EXISTS "viaje_servicios_hora_final_idx" ON "viaje_servicios" ("hora_final");

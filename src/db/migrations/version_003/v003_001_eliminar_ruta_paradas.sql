DROP TABLE IF EXISTS "ruta_paradas" CASCADE;

ALTER TABLE "viaje_servicios" DROP COLUMN IF EXISTS "parada_partida_id";
ALTER TABLE "viaje_servicios" DROP COLUMN IF EXISTS "parada_llegada_id";

-- Cambiar costo_base por tiempo_estimado (entero)
ALTER TABLE "rutas" RENAME COLUMN "costo_base" TO "tiempo_estimado";
ALTER TABLE "rutas" ALTER COLUMN "tiempo_estimado" TYPE integer USING (tiempo_estimado::integer);

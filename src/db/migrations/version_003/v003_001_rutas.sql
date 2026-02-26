-- 1. Modificar tabla de rutas
-- Cambiar costo_base por tiempo_estimado (entero)
ALTER TABLE "rutas" RENAME COLUMN "costo_base" TO "tiempo_estimado";
ALTER TABLE "rutas" ALTER COLUMN "tiempo_estimado" TYPE integer USING (tiempo_estimado::integer);

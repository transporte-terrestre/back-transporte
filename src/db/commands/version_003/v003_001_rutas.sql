-- 1. Establecer tiempo estimado por defecto (60 min) a todas las rutas existentes
UPDATE "rutas" SET "tiempo_estimado" = 60 WHERE "tiempo_estimado" IS NULL;

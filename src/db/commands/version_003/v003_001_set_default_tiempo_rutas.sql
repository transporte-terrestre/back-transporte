-- Command v003_001: Establecer tiempo estimado por defecto
-- Tarea: Poner 1 hora (60 minutos) a todas las rutas existentes

UPDATE "rutas" SET "tiempo_estimado" = 60;

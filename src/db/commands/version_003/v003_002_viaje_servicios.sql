-- 2. Migrar tipos de servicio antiguos a la nueva jerarquía
UPDATE "viaje_servicios" SET "tipo" = 'parada' WHERE "tipo"::text = 'trayecto';

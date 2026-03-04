-- command.sql
-- Step 1: Transfer all existing real dates (which were actually the scheduled dates) into the programadas fields
UPDATE "viajes" SET 
  "fecha_salida_programada" = "fecha_salida",
  "fecha_llegada_programada" = "fecha_llegada";

-- Step 2: Clear the "real" dates for trips that haven't actually started/finished
UPDATE "viajes" SET 
  "fecha_salida" = NULL
WHERE "estado" = 'programado';

UPDATE "viajes" SET 
  "fecha_llegada" = NULL
WHERE "estado" IN ('programado', 'en_progreso');

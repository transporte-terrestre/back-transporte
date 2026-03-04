-- 12. Renombrar viaje_servicios a viaje_tramos para mayor claridad semántica

-- Renombrar tabla principal
ALTER TABLE "viaje_servicios" RENAME TO "viaje_tramos";

-- Renombrar el enum asociado
ALTER TYPE "tipo_servicio" RENAME TO "tipo_tramo";

-- Renombrar columna en la tabla de movimientos de pasajeros
ALTER TABLE "viaje_pasajero_movimientos" RENAME COLUMN "viaje_servicio_id" TO "viaje_tramo_id";

-- Renombrar índices para mantener la consistencia
ALTER INDEX "viaje_servicios_hora_final_idx" RENAME TO "viaje_tramos_hora_final_idx";
-- Nota: El índice de viaje_id no fue creado con nombre explícito pero Drizzle por defecto usa la misma nomenclatura.
-- Si existe el índice de movimientos lo renombramos también.
ALTER INDEX IF EXISTS "viaje_pasajero_movimientos_viaje_servicio_id_idx" RENAME TO "viaje_pasajero_movimientos_viaje_tramo_id_idx";

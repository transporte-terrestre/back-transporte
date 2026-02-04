-- Migración: Agregar campos turno y numero_vale a viajes
-- Fecha: 2026-01-31
-- Descripción: Campos para el reporte diario de trabajo

-- Crear enum para turno
CREATE TYPE "viajes_turno" AS ENUM('dia', 'noche');

-- Agregar columna turno
ALTER TABLE "viajes" ADD COLUMN "turno" "viajes_turno";

-- Agregar columna numero_vale
ALTER TABLE "viajes" ADD COLUMN "numero_vale" VARCHAR(50);

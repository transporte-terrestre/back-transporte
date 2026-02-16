-- Migración: Hacer opcionales las referencias de ruta en circuitos
-- Fecha: 2026-02-15
-- Descripción: Permitir nulos en ruta_ida_id y ruta_vuelta_id para soportar circuitos flexibles (solo ida o solo vuelta)

ALTER TABLE "ruta_circuitos" ALTER COLUMN "ruta_ida_id" DROP NOT NULL;
ALTER TABLE "ruta_circuitos" ALTER COLUMN "ruta_vuelta_id" DROP NOT NULL;

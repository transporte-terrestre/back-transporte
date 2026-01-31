-- Migración: Agregar campo contrasenia a tabla conductores
-- Fecha: 2026-01-31
-- Descripción: Permite que los conductores tengan contraseña para autenticación

ALTER TABLE "conductores" ADD COLUMN "contrasenia" varchar(255);

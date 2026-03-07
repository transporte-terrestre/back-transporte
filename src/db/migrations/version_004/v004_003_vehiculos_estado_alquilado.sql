-- Migración: Agregar el estado 'alquilado' a los tipos de estado de vehículo

ALTER TYPE vehiculos_estado ADD VALUE IF NOT EXISTS 'alquilado';

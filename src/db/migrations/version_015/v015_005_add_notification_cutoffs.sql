-- Permite ocultar o marcar como leídas las notificaciones anteriores a una fecha
-- sin crear/actualizar una relación por cada notificación del usuario.

ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS notificaciones_eliminadas_desde TIMESTAMP,
  ADD COLUMN IF NOT EXISTS notificaciones_leidas_desde TIMESTAMP;

-- Ensure cleanup of any previous attempt
DROP TABLE IF EXISTS conductor_notificaciones;

-- Create the new table
CREATE TABLE IF NOT EXISTS notificaciones_conductor_leidas (
  id SERIAL PRIMARY KEY,
  conductor_id INTEGER NOT NULL REFERENCES conductores(id),
  notificacion_id INTEGER NOT NULL REFERENCES notificaciones(id),
  creado_en TIMESTAMP DEFAULT NOW() NOT NULL,
  leido_en TIMESTAMP
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_notificaciones_conductor_leidas_conductor_id ON notificaciones_conductor_leidas(conductor_id);

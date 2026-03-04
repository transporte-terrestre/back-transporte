-- Limpiar posibles columnas erróneas de migraciones previas
ALTER TABLE talleres DROP COLUMN IF EXISTS sucursal_id;

-- Crear tabla de sucursales
CREATE TABLE IF NOT EXISTS sucursales (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  direccion VARCHAR(255),
  creado_en TIMESTAMP DEFAULT NOW() NOT NULL,
  actualizado_en TIMESTAMP DEFAULT NOW() NOT NULL,
  eliminado_en TIMESTAMP
);

CREATE INDEX IF NOT EXISTS sucursales_nombre_idx ON sucursales USING gin (nombre gin_trgm_ops);

-- Crear tabla intermedia para relación Muchos a Muchos (M2M) entre Talleres y Sucursales
CREATE TABLE IF NOT EXISTS taller_sucursales (
  id SERIAL PRIMARY KEY,
  taller_id INTEGER REFERENCES talleres(id) ON DELETE CASCADE NOT NULL,
  sucursal_id INTEGER REFERENCES sucursales(id) ON DELETE CASCADE NOT NULL,
  creado_en TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS taller_sucursales_unique_idx ON taller_sucursales (taller_id, sucursal_id);

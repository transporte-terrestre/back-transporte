-- Migración: Crear tabla entidades (relación cliente -> entidades/servicios)
-- Requiere extensión pg_trgm ya habilitada

CREATE TABLE IF NOT EXISTS entidades (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  nombre_servicio VARCHAR(200) NOT NULL,
  creado_en TIMESTAMP DEFAULT NOW() NOT NULL,
  actualizado_en TIMESTAMP DEFAULT NOW() NOT NULL,
  eliminado_en TIMESTAMP
);

-- Índice para búsqueda por cliente
CREATE INDEX IF NOT EXISTS entidades_cliente_id_idx ON entidades(cliente_id);

-- Índice GIN para búsqueda fuzzy por nombre del servicio
CREATE INDEX IF NOT EXISTS entidades_nombre_servicio_idx ON entidades USING gin(nombre_servicio gin_trgm_ops);

-- Unique parcial: un cliente no puede tener dos entidades con el mismo nombre (si no están eliminadas)
CREATE UNIQUE INDEX IF NOT EXISTS entidades_cliente_nombre_unique_active_idx
  ON entidades(cliente_id, nombre_servicio)
  WHERE eliminado_en IS NULL;

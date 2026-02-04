-- Migración: Crear tabla ruta_paradas
-- Fecha: 2026-01-31
-- Descripción: Tabla para almacenar las paradas/puntos de una ruta

CREATE TABLE "ruta_paradas" (
  "id" SERIAL PRIMARY KEY,
  "ruta_id" INTEGER NOT NULL REFERENCES "rutas"("id") ON DELETE CASCADE,
  "orden" INTEGER NOT NULL,
  "nombre" VARCHAR(200) NOT NULL,
  "ubicacion_lat" DECIMAL(10, 7),
  "ubicacion_lng" DECIMAL(10, 7),
  "creado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
  "actualizado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
  "eliminado_en" TIMESTAMP
);

-- Índice GIN para búsqueda rápida por nombre (requiere extensión pg_trgm)
CREATE INDEX "ruta_paradas_nombre_idx" ON "ruta_paradas" USING GIN ("nombre" gin_trgm_ops);

-- Índice para filtrar por ruta
CREATE INDEX "ruta_paradas_ruta_id_idx" ON "ruta_paradas" ("ruta_id");

-- Índice compuesto para ordenar paradas dentro de una ruta
CREATE INDEX "ruta_paradas_ruta_orden_idx" ON "ruta_paradas" ("ruta_id", "orden");

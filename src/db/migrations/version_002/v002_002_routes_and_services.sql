-- Migración Consolidada v002_002: Rutas y Servicios
-- Incluye: Ruta Paradas, Ruta Circuitos, Viaje Servicios

-- 1. Ruta Paradas
CREATE TABLE IF NOT EXISTS "ruta_paradas" (
  "id" SERIAL PRIMARY KEY,
  "ruta_id" INTEGER NOT NULL REFERENCES "rutas"("id") ON DELETE CASCADE,
  "orden" INTEGER NOT NULL,
  "nombre" VARCHAR(200) NOT NULL,
  "ubicacion_lat" DECIMAL(10, 7),
  "ubicacion_lng" DECIMAL(10, 7),
  "distancia_previa_parada" DECIMAL(10, 2),
  "creado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
  "actualizado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
  "eliminado_en" TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "ruta_paradas_nombre_idx" ON "ruta_paradas" USING GIN ("nombre" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "ruta_paradas_ruta_id_idx" ON "ruta_paradas" ("ruta_id");
CREATE INDEX IF NOT EXISTS "ruta_paradas_ruta_orden_idx" ON "ruta_paradas" ("ruta_id", "orden");

-- 2. Ruta Circuitos
CREATE TABLE IF NOT EXISTS "ruta_circuitos" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR(200) NOT NULL,
    "ruta_ida_id" INTEGER NOT NULL REFERENCES "rutas"("id") ON DELETE RESTRICT,
    "ruta_vuelta_id" INTEGER NOT NULL REFERENCES "rutas"("id") ON DELETE RESTRICT,
    "es_igual" BOOLEAN DEFAULT FALSE NOT NULL,
    "creado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
    "actualizado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
    "eliminado_en" TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "ruta_circuitos_nombre_idx" ON "ruta_circuitos" USING gin ("nombre" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "ruta_circuitos_ruta_ida_idx" ON "ruta_circuitos" ("ruta_ida_id");
CREATE INDEX IF NOT EXISTS "ruta_circuitos_ruta_vuelta_idx" ON "ruta_circuitos" ("ruta_vuelta_id");

-- 3. Viaje Servicios
CREATE TABLE IF NOT EXISTS "viaje_servicios" (
  "id" SERIAL PRIMARY KEY,
  "viaje_id" INTEGER NOT NULL REFERENCES "viajes"("id") ON DELETE CASCADE,
  "orden" INTEGER NOT NULL,
  
  -- Punto de partida
  "parada_partida_id" INTEGER REFERENCES "ruta_paradas"("id"),
  "parada_partida_nombre" VARCHAR(200),
  
  -- Punto de llegada
  "parada_llegada_id" INTEGER REFERENCES "ruta_paradas"("id"),
  "parada_llegada_nombre" VARCHAR(200),
  
  -- Datos del servicio
  "hora_salida" TIME NOT NULL,
  "hora_termino" TIME,
  "km_inicial" INTEGER NOT NULL,
  "km_final" INTEGER,
  "numero_pasajeros" INTEGER DEFAULT 0,
  
  -- Observaciones
  "observaciones" TEXT,
  
  -- Timestamps
  "creado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
  "actualizado_en" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS "viaje_servicios_viaje_id_idx" ON "viaje_servicios" ("viaje_id");
CREATE INDEX IF NOT EXISTS "viaje_servicios_viaje_orden_idx" ON "viaje_servicios" ("viaje_id", "orden");

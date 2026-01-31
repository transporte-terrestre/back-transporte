-- Migración: Crear tabla viaje_servicios
-- Fecha: 2026-01-31
-- Descripción: Tabla para almacenar cada tramo/servicio del viaje (Trabajo Efectivo Diario)

CREATE TABLE "viaje_servicios" (
  "id" SERIAL PRIMARY KEY,
  "viaje_id" INTEGER NOT NULL REFERENCES "viajes"("id") ON DELETE CASCADE,
  "orden" INTEGER NOT NULL,
  
  -- Punto de partida: referencia a parada fija O texto libre
  "parada_partida_id" INTEGER REFERENCES "ruta_paradas"("id"),
  "parada_partida_ocasional" VARCHAR(200),
  
  -- Punto de llegada: referencia a parada fija O texto libre
  "parada_llegada_id" INTEGER REFERENCES "ruta_paradas"("id"),
  "parada_llegada_ocasional" VARCHAR(200),
  
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

-- Índice para filtrar servicios por viaje
CREATE INDEX "viaje_servicios_viaje_id_idx" ON "viaje_servicios" ("viaje_id");

-- Índice compuesto para ordenar servicios dentro de un viaje
CREATE INDEX "viaje_servicios_viaje_orden_idx" ON "viaje_servicios" ("viaje_id", "orden");

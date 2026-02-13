-- Crear tabla ruta_circuitos
CREATE TABLE IF NOT EXISTS "ruta_circuitos" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR(200) NOT NULL,
    "ruta_ida_id" INTEGER NOT NULL REFERENCES "rutas"("id") ON DELETE RESTRICT,
    "ruta_vuelta_id" INTEGER NOT NULL REFERENCES "rutas"("id") ON DELETE RESTRICT,
    "creado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
    "actualizado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
    "eliminado_en" TIMESTAMP
);

-- Índices para ruta_circuitos
CREATE INDEX IF NOT EXISTS "ruta_circuitos_nombre_idx" ON "ruta_circuitos" USING gin ("nombre" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "ruta_circuitos_ruta_ida_idx" ON "ruta_circuitos" ("ruta_ida_id");
CREATE INDEX IF NOT EXISTS "ruta_circuitos_ruta_vuelta_idx" ON "ruta_circuitos" ("ruta_vuelta_id");

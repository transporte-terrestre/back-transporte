-- Migración: Sistema de Checklist Versionado (Consolidada)
-- Fecha: 2026-02-05
-- Descripción: Implementación de versionado completo para checklists + Soporte de Viajes

-- 1. ENUMS
-- Enum para tipo de checklist (Existente)
DO $$ BEGIN
    CREATE TYPE "viaje_checklist_tipo" AS ENUM('salida', 'llegada');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enum para tipos de input (Nuevo)
DO $$ BEGIN
    CREATE TYPE "checklist_input_tipo" AS ENUM('check', 'texto', 'fecha', 'cantidad', 'foto', 'opciones');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. TABLA: CATALOGO DE TIPOS DE CHECKLIST (checklist_items)
CREATE TABLE IF NOT EXISTS "checklist_items" (
  "id" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) NOT NULL,
  "descripcion" TEXT,
  "orden" INTEGER DEFAULT 0 NOT NULL,
  "creado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
  "actualizado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
  "eliminado_en" TIMESTAMP
);

-- 3. TABLA: CABECERA DE CONFIGURACION VERSIONADA
CREATE TABLE IF NOT EXISTS "vehiculo_checklist_documents" (
  "id" SERIAL PRIMARY KEY,
  "vehiculo_id" INTEGER NOT NULL REFERENCES "vehiculos"("id"),
  "checklist_item_id" INTEGER NOT NULL REFERENCES "checklist_items"("id"),
  "version" TEXT NOT NULL,
  "activo" BOOLEAN DEFAULT TRUE NOT NULL,
  "viaje_id" INTEGER REFERENCES "viajes"("id"),
  "creado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
  "eliminado_en" TIMESTAMP
);

-- Indices de integridad de versiones
CREATE UNIQUE INDEX IF NOT EXISTS "vehiculo_checklist_document_version_unique_idx"
ON "vehiculo_checklist_documents" ("vehiculo_id", "checklist_item_id", "version")
WHERE "eliminado_en" IS NULL;

-- Indice para asegurar solo una configuración activa por tipo (Considerar: Si es por viaje, esto aplica?)
-- Si activo=TRUE solo debe haber uno por vehiculo+tipo. 
-- Si queremos históricos por viaje, al crear uno nuevo desactivamos el anterior global, 
-- pero mantenemos la referencia 'viaje_id' para búsqueda histórica.
CREATE UNIQUE INDEX IF NOT EXISTS "vehiculo_checklist_document_active_unique_idx"
ON "vehiculo_checklist_documents" ("vehiculo_id", "checklist_item_id")
WHERE "activo" IS TRUE AND "eliminado_en" IS NULL;

-- Indice por viaje
CREATE INDEX IF NOT EXISTS "vehiculo_checklist_document_viaje_idx" 
ON "vehiculo_checklist_documents" ("viaje_id");

-- 4. TABLA: ITEMS DE LA CONFIGURACION (Inmutables por versión)
CREATE TABLE IF NOT EXISTS "vehiculo_checklist_document_items" (
  "id" SERIAL PRIMARY KEY,
  "vehiculo_checklist_document_id" INTEGER NOT NULL REFERENCES "vehiculo_checklist_documents"("id") ON DELETE CASCADE,
  "label" VARCHAR(255) NOT NULL,
  "tipo_input" "checklist_input_tipo" NOT NULL,
  "valor_esperado" VARCHAR(255),
  "orden" INTEGER DEFAULT 0 NOT NULL,
  "metadatos" JSONB
);

-- 5. TABLA: CHECKLISTS POR VIAJE (Evento Cabecera - Entrada/Salida General)
CREATE TABLE IF NOT EXISTS "viaje_checklists" (
  "id" SERIAL PRIMARY KEY,
  "viaje_id" INTEGER NOT NULL REFERENCES "viajes"("id") ON DELETE CASCADE,
  "tipo" "viaje_checklist_tipo" NOT NULL,
  "validado_por" INTEGER REFERENCES "usuarios"("id"),
  "validado_en" TIMESTAMP,
  "observaciones" TEXT,
  "creado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
  "actualizado_en" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS "viaje_checklists_viaje_id_idx" ON "viaje_checklists" ("viaje_id");
CREATE UNIQUE INDEX IF NOT EXISTS "viaje_checklists_viaje_tipo_unique_idx" ON "viaje_checklists" ("viaje_id", "tipo");

-- 6. TABLA: EJECUCION DE CHECKLIST (Link a Versión + Respuestas)
-- Esta tabla permite 'instanciar' un documento de checklist (definición) dentro de un evento de Entrada/Salida
-- Modificado: Eliminado respuesta_json y tiene_hallazgos
CREATE TABLE IF NOT EXISTS "viaje_checklist_items" (
  "viaje_checklist_id" INTEGER NOT NULL REFERENCES "viaje_checklists"("id") ON DELETE CASCADE,
  "checklist_item_id" INTEGER NOT NULL REFERENCES "checklist_items"("id"),
  "vehiculo_checklist_document_id" INTEGER NOT NULL REFERENCES "vehiculo_checklist_documents"("id"),
  "observacion" TEXT,
  "creado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
  "actualizado_en" TIMESTAMP DEFAULT NOW() NOT NULL,
  PRIMARY KEY ("viaje_checklist_id", "checklist_item_id")
);

CREATE INDEX IF NOT EXISTS "viaje_checklist_items_checklist_id_idx" ON "viaje_checklist_items" ("viaje_checklist_id");
-- Unique index no longer needed as PK is unique
-- CREATE UNIQUE INDEX IF NOT EXISTS "viaje_checklist_items_unique_idx" ON "viaje_checklist_items" ("viaje_checklist_id", "checklist_item_id");

-- Migration: v012_001_update_auditoria_table.sql
-- Description: Add conductor_id, make usuario_id nullable, and add standard metadata fields.

-- 1. Add conductor_id column and foreign key
ALTER TABLE "auditorias" ADD COLUMN IF NOT EXISTS "conductor_id" integer;

DO $$ BEGIN
 ALTER TABLE "auditorias" 
 ADD CONSTRAINT "auditorias_conductor_id_conductores_id_fk" 
 FOREIGN KEY ("conductor_id") REFERENCES "public"."conductores"("id") 
 ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- 2. Alter usuario_id to be nullable
ALTER TABLE "auditorias" ALTER COLUMN "usuario_id" DROP NOT NULL;

-- 3. Add standard metadata fields
ALTER TABLE "auditorias" ADD COLUMN IF NOT EXISTS "creado_en" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "auditorias" ADD COLUMN IF NOT EXISTS "actualizado_en" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "auditorias" ADD COLUMN IF NOT EXISTS "eliminado_en" timestamp;

-- 4. Migrate existing fecha_hora to creado_en (optional but good for consistency)
UPDATE "auditorias" SET "creado_en" = "fecha_hora" WHERE "creado_en" = "fecha_hora";

-- 5. Create new indices
CREATE INDEX IF NOT EXISTS "auditorias_conductor_id_idx" ON "auditorias" USING btree ("conductor_id");
CREATE INDEX IF NOT EXISTS "auditorias_creado_en_idx" ON "auditorias" USING btree ("creado_en");

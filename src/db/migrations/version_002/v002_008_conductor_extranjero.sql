DO $$ BEGIN
    CREATE TYPE "conductores_tipo_documento" AS ENUM ('DNI', 'CE', 'PTP', 'PASAPORTE', 'OTRO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "conductores" ADD COLUMN "tipo_documento" "conductores_tipo_documento" DEFAULT 'DNI' NOT NULL;
ALTER TABLE "conductores" ADD COLUMN "nacionalidad" varchar(100);

-- Update existing records to have 'Peruana' nationality if needed, or leave null
UPDATE "conductores" SET "nacionalidad" = 'Peruana' WHERE "nacionalidad" IS NULL;

-- Remove length constraint on dni if it was strictly 8 chars (it was defined as varchar(20), so it's fine)
-- If there was a check constraint, we'd need to drop it. Drizzle definition didn't show check constraint, just type.

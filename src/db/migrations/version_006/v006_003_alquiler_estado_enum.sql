DO $$ BEGIN
    CREATE TYPE "alquiler_estado" AS ENUM('activo', 'finalizado', 'cancelado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop default first to avoid casting issues
ALTER TABLE "alquileres" ALTER COLUMN "estado" DROP DEFAULT;

-- Perform the conversion
ALTER TABLE "alquileres" ALTER COLUMN "estado" TYPE "alquiler_estado" USING "estado"::"alquiler_estado";

-- Re-add the default
ALTER TABLE "alquileres" ALTER COLUMN "estado" SET DEFAULT 'activo';

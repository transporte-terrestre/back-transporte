DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'conductores_estado') THEN
        CREATE TYPE "conductores_estado" AS ENUM('activo', 'inactivo', 'eventual');
    END IF;
END $$;

ALTER TABLE "conductores" ADD COLUMN IF NOT EXISTS "estado" "conductores_estado" DEFAULT 'activo' NOT NULL;

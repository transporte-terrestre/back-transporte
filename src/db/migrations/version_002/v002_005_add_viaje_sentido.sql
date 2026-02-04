DO $$ BEGIN
    CREATE TYPE "viajes_sentido" AS ENUM ('ida', 'vuelta');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "viajes" ADD COLUMN IF NOT EXISTS "sentido" "viajes_sentido" DEFAULT 'ida' NOT NULL;

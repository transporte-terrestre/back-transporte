DO $$ BEGIN
    CREATE TYPE "clientes_tipo" AS ENUM('personal', 'corporativo');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "clientes" ADD COLUMN "tipo" "clientes_tipo" DEFAULT 'personal' NOT NULL;

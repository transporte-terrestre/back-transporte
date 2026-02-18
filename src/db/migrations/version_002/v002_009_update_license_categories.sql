-- Rename existing enum type if possible, or just create new one
-- Postgres doesn't easily support renaming enum values or adding bulk values, 
-- but we can add values one by one or create a new type.
-- Given the significant change (Uno, Dos, Tres -> I, IIa, IIb, IIIa, IIIb, IIIc), 
-- it's safer to create a new enum and alter table.

DO $$ BEGIN
    CREATE TYPE "conductores_categoria_licencia_new" AS ENUM ('I', 'II-a', 'II-b', 'III-a', 'III-b', 'III-c');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop default value if exists (it might depend on the old enum)
ALTER TABLE "conductores" ALTER COLUMN "categoria_licencia" DROP DEFAULT;

-- Alter column to new type with a mapping (casting)
-- Since we are changing values completely:
-- 'Uno' -> 'I'
-- 'Dos' -> 'II-a' (assumption)
-- 'Tres' -> 'III-a' (assumption)
-- Or we just set them to NULL or a default if mapping is ambiguous.
-- Let's try to map reasonable defaults to avoid data loss.

ALTER TABLE "conductores" 
  ALTER COLUMN "categoria_licencia" TYPE "conductores_categoria_licencia_new" 
  USING (CASE "categoria_licencia"::text
    WHEN 'Uno' THEN 'I'::"conductores_categoria_licencia_new"
    WHEN 'Dos' THEN 'II-a'::"conductores_categoria_licencia_new"
    WHEN 'Tres' THEN 'III-a'::"conductores_categoria_licencia_new"
    ELSE 'I'::"conductores_categoria_licencia_new"
  END);

-- Drop old enum type
DROP TYPE "conductores_categoria_licencia";

-- Rename new type to old name
ALTER TYPE "conductores_categoria_licencia_new" RENAME TO "conductores_categoria_licencia";

-- Restore default if needed (e.g. 'I')
ALTER TABLE "conductores" ALTER COLUMN "categoria_licencia" SET DEFAULT 'I';

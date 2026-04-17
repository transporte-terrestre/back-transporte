-- Migration: v013_001_add_categoria_ii_c.sql
-- Description: Ensure conductores_categoria_licencia enum includes II-c.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'conductores_categoria_licencia'
      AND e.enumlabel = 'II-c'
  ) THEN
    ALTER TYPE "conductores_categoria_licencia" ADD VALUE 'II-c' AFTER 'II-b';
  END IF;
END $$;

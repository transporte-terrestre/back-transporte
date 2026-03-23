-- v007_007_conductor_documentos_optional_dates.sql
-- Alter conductor_documentos table to make dates optional
ALTER TABLE "conductor_documentos" ALTER COLUMN "fecha_expiracion" DROP NOT NULL;
ALTER TABLE "conductor_documentos" ALTER COLUMN "fecha_emision" DROP NOT NULL;

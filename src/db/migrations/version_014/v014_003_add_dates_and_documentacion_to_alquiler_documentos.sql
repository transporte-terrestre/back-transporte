ALTER TYPE alquiler_documentos_tipo ADD VALUE IF NOT EXISTS 'documentacion';

ALTER TABLE alquiler_documentos ADD COLUMN IF NOT EXISTS fecha_expiracion DATE;
ALTER TABLE alquiler_documentos ADD COLUMN IF NOT EXISTS fecha_emision DATE;

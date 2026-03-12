ALTER TABLE conductores ADD COLUMN documentos_no_aplicables conductor_documentos_tipo[] DEFAULT ARRAY[]::conductor_documentos_tipo[];

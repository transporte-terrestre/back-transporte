ALTER TYPE vehiculo_documentos_tipo RENAME VALUE 'certificado_norma_r66' TO 'certificado_rops';
ALTER TYPE vehiculo_documentos_tipo ADD VALUE IF NOT EXISTS 'certificado_extintores_operatividad';
ALTER TYPE vehiculo_documentos_tipo ADD VALUE IF NOT EXISTS 'certificado_radio_frecuencia';
ALTER TYPE vehiculo_documentos_tipo ADD VALUE IF NOT EXISTS 'certificacion_frenos';

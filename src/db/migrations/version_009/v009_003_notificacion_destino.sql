CREATE TYPE notificacion_destino AS ENUM ('sistema', 'clientes', 'usuarios', 'conductor');
ALTER TABLE notificaciones ADD COLUMN destino notificacion_destino DEFAULT 'sistema' NOT NULL;

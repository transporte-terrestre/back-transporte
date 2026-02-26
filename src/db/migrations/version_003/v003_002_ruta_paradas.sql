-- 2. Manejo de ruta_paradas (Limpieza y recreación)
DROP TABLE IF EXISTS "ruta_paradas" CASCADE;

CREATE TABLE IF NOT EXISTS "ruta_paradas" (
  "id" serial PRIMARY KEY NOT NULL,
  "ruta_id" integer NOT NULL,
  "orden" integer NOT NULL,
  "nombre" varchar(255) NOT NULL,
  "ubicacion_lat" numeric(10, 7) NOT NULL,
  "ubicacion_lng" numeric(10, 7) NOT NULL,
  "distancia_previa_parada" numeric(10, 2),
  "tiempo_estimado" integer,
  "creado_en" timestamp DEFAULT now() NOT NULL,
  "actualizado_en" timestamp DEFAULT now() NOT NULL,
  "eliminado_en" timestamp
);

DO $$ BEGIN
  ALTER TABLE "ruta_paradas" ADD CONSTRAINT "ruta_paradas_ruta_id_rutas_id_fk" 
  FOREIGN KEY ("ruta_id") REFERENCES "rutas"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

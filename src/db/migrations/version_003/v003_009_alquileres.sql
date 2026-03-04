CREATE TABLE IF NOT EXISTS "alquileres" (
    "id" serial PRIMARY KEY NOT NULL,
    "vehiculo_id" integer NOT NULL,
    "fecha_inicio" timestamp NOT NULL,
    "fecha_fin" timestamp,
    "monto" numeric(10, 2),
    "observaciones" varchar(500),
    "estado" varchar(50) DEFAULT 'activo' NOT NULL,
    "creado_en" timestamp DEFAULT now() NOT NULL,
    "actualizado_en" timestamp DEFAULT now() NOT NULL,
    "eliminado_en" timestamp
);

DO $$ BEGIN
 ALTER TABLE "alquileres" ADD CONSTRAINT "alquileres_vehiculo_id_vehiculos_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "alquileres_vehiculo_id_idx" ON "alquileres" ("vehiculo_id");
CREATE INDEX IF NOT EXISTS "alquileres_estado_idx" ON "alquileres" ("estado");

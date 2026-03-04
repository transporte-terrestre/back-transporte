ALTER TABLE "vehiculos" DROP COLUMN IF EXISTS "anotaciones";

DO $$ BEGIN
 CREATE TYPE "public"."vehiculo_comentarios_tipo" AS ENUM('observacion', 'incidencia', 'novedad', 'general');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "vehiculo_comentarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehiculo_id" integer NOT NULL,
	"usuario_id" integer NOT NULL,
	"comentario" text NOT NULL,
	"tipo" "vehiculo_comentarios_tipo" NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp DEFAULT now() NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "vehiculo_comentarios" ADD CONSTRAINT "vehiculo_comentarios_vehiculo_id_vehiculos_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."vehiculos"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "vehiculo_comentarios" ADD CONSTRAINT "vehiculo_comentarios_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

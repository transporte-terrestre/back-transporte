DO $$ BEGIN
 CREATE TYPE "public"."auditoria_accion" AS ENUM('CREAR', 'EDITAR', 'ELIMINAR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "auditorias" (
	"id" serial PRIMARY KEY NOT NULL,
	"accion" "auditoria_accion" NOT NULL,
	"usuario_id" integer NOT NULL,
	"modulo" varchar(255) NOT NULL,
	"detalle" jsonb NOT NULL,
	"fecha_hora" timestamp DEFAULT now() NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "auditorias" ADD CONSTRAINT "auditorias_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "auditorias_usuario_id_idx" ON "auditorias" USING btree ("usuario_id");
CREATE INDEX IF NOT EXISTS "auditorias_accion_idx" ON "auditorias" USING btree ("accion");
CREATE INDEX IF NOT EXISTS "auditorias_modulo_idx" ON "auditorias" USING btree ("modulo");
CREATE INDEX IF NOT EXISTS "auditorias_fecha_hora_idx" ON "auditorias" USING btree ("fecha_hora");

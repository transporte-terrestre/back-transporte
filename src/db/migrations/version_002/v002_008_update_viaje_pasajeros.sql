/* Eliminar columna tripulantes de viajes */
ALTER TABLE "viajes" DROP COLUMN IF EXISTS "tripulantes";

/* Crear tabla viaje_pasajeros */
CREATE TABLE IF NOT EXISTS "viaje_pasajeros" (
	"viaje_id" integer NOT NULL,
	"pasajero_id" integer NOT NULL,
	"asistencia" boolean DEFAULT false NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "viaje_pasajeros_viaje_id_pasajero_id_pk" PRIMARY KEY("viaje_id","pasajero_id")
);

/* Crear foreign keys e índices */
DO $$ BEGIN
 ALTER TABLE "viaje_pasajeros" ADD CONSTRAINT "viaje_pasajeros_viaje_id_viajes_id_fk" FOREIGN KEY ("viaje_id") REFERENCES "public"."viajes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "viaje_pasajeros" ADD CONSTRAINT "viaje_pasajeros_pasajero_id_pasajeros_id_fk" FOREIGN KEY ("pasajero_id") REFERENCES "public"."pasajeros"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "viaje_pasajeros_viaje_id_idx" ON "viaje_pasajeros" ("viaje_id");
CREATE INDEX IF NOT EXISTS "viaje_pasajeros_pasajero_id_idx" ON "viaje_pasajeros" ("pasajero_id");

CREATE TABLE IF NOT EXISTS "viaje_circuitos" (
	"id" serial PRIMARY KEY NOT NULL,
	"viaje_ida_id" integer,
	"viaje_vuelta_id" integer,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp DEFAULT now() NOT NULL,
	"eliminado_en" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "viaje_circuitos" ADD CONSTRAINT "viaje_circuitos_viaje_ida_id_viajes_id_fk" FOREIGN KEY ("viaje_ida_id") REFERENCES "public"."viajes"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "viaje_circuitos" ADD CONSTRAINT "viaje_circuitos_viaje_vuelta_id_viajes_id_fk" FOREIGN KEY ("viaje_vuelta_id") REFERENCES "public"."viajes"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "viaje_circuitos_viaje_ida_idx" ON "viaje_circuitos" ("viaje_ida_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "viaje_circuitos_viaje_vuelta_idx" ON "viaje_circuitos" ("viaje_vuelta_id");

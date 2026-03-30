CREATE TABLE IF NOT EXISTS "viaje_repostaje_movimientos" (
	"id" serial PRIMARY KEY NOT NULL,
	"viaje_tramo_id" integer NOT NULL,
	"combustible" "combustible_tipo" NOT NULL,
	"galones_establecidos" numeric(10, 2) NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp DEFAULT now() NOT NULL,
	"eliminado_en" timestamp
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "viaje_repostaje_movimientos_viaje_tramo_id_idx" ON "viaje_repostaje_movimientos" USING btree ("viaje_tramo_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "viaje_repostaje_movimientos" ADD CONSTRAINT "v_r_m_viaje_tramo_id_fk" FOREIGN KEY ("viaje_tramo_id") REFERENCES "public"."viaje_tramos"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

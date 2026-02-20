ALTER TABLE "viaje_checklists" DROP CONSTRAINT IF EXISTS "viaje_checklists_validado_por_fkey";
ALTER TABLE "viaje_checklists" DROP CONSTRAINT IF EXISTS "viaje_checklists_validado_por_usuarios_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "viaje_checklists" ADD CONSTRAINT "viaje_checklists_validado_por_conductores_id_fk" FOREIGN KEY ("validado_por") REFERENCES "public"."conductores"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

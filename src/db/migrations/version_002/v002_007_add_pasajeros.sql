CREATE TABLE IF NOT EXISTS "pasajeros" (
	"id" serial PRIMARY KEY NOT NULL,
	"cliente_id" integer NOT NULL,
	"dni" varchar(20) NOT NULL,
	"nombres" varchar(100) NOT NULL,
	"apellidos" varchar(100) NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp DEFAULT now() NOT NULL,
	"eliminado_en" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pasajeros" ADD CONSTRAINT "pasajeros_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pasajeros_cliente_id_idx" ON "pasajeros" ("cliente_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pasajeros_dni_idx" ON "pasajeros" ("dni");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pasajeros_nombres_idx" ON "pasajeros" USING gin ("nombres" gin_trgm_ops);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pasajeros_apellidos_idx" ON "pasajeros" USING gin ("apellidos" gin_trgm_ops);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "pasajeros_cliente_dni_unique_active_idx" ON "pasajeros" ("cliente_id","dni") WHERE "pasajeros"."eliminado_en" IS NULL;

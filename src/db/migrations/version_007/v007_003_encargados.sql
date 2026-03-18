CREATE TABLE IF NOT EXISTS "encargados" (
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
CREATE INDEX IF NOT EXISTS "encargados_cliente_id_idx" ON "encargados" ("cliente_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "encargados_dni_idx" ON "encargados" ("dni");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "encargados_nombres_idx" ON "encargados" USING gin ("nombres" gin_trgm_ops);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "encargados_apellidos_idx" ON "encargados" USING gin ("apellidos" gin_trgm_ops);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "encargados_cliente_dni_unique_active_idx" ON "encargados" ("cliente_id","dni") WHERE "eliminado_en" IS NULL;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "encargados" ADD CONSTRAINT "encargados_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

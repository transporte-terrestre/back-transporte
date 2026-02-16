-- Migración Consolidada v002_004: Pasajeros y Tripulantes
-- Incluye: Tabla Pasajeros y Viaje Pasajeros

-- 1. Tabla Pasajeros
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

DO $$ BEGIN
 ALTER TABLE "pasajeros" ADD CONSTRAINT "pasajeros_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "pasajeros_cliente_id_idx" ON "pasajeros" ("cliente_id");
CREATE INDEX IF NOT EXISTS "pasajeros_dni_idx" ON "pasajeros" ("dni");
CREATE INDEX IF NOT EXISTS "pasajeros_nombres_idx" ON "pasajeros" USING gin ("nombres" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "pasajeros_apellidos_idx" ON "pasajeros" USING gin ("apellidos" gin_trgm_ops);
CREATE UNIQUE INDEX IF NOT EXISTS "pasajeros_cliente_dni_unique_active_idx" ON "pasajeros" ("cliente_id","dni") WHERE "pasajeros"."eliminado_en" IS NULL;

-- 2. Eliminar columna tripulantes de viajes
ALTER TABLE "viajes" DROP COLUMN IF EXISTS "tripulantes";

-- 3. Tabla Viaje Pasajeros
CREATE TABLE IF NOT EXISTS "viaje_pasajeros" (
    "viaje_id" integer NOT NULL,
    "pasajero_id" integer NOT NULL,
    "asistencia" boolean DEFAULT false NOT NULL,
    "creado_en" timestamp DEFAULT now() NOT NULL,
    "actualizado_en" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "viaje_pasajeros_viaje_id_pasajero_id_pk" PRIMARY KEY("viaje_id","pasajero_id")
);

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

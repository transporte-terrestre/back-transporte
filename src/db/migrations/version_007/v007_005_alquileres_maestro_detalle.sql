-- Migration: Restructuring Alquileres to Master-Detail
-- Date: 2026-03-19

-- 1. Create Enum for History Actions
DO $$ BEGIN
    CREATE TYPE "alquiler_historial_accion" AS ENUM('ALTA_VEHICULO', 'BAJA_VEHICULO', 'CAMBIO_PRECIO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Alquiler Detalle Table
CREATE TABLE IF NOT EXISTS "alquiler_detalle" (
	"id" serial PRIMARY KEY NOT NULL,
	"alquiler_id" integer NOT NULL,
	"vehiculo_id" integer NOT NULL,
	"conductor_id" integer,
	"tipo" "alquiler_tipo" DEFAULT 'maquina_seca' NOT NULL,
	"kilometraje_inicial" numeric(12, 2) NOT NULL,
	"kilometraje_final" numeric(12, 2),
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp DEFAULT now() NOT NULL,
	"eliminado_en" timestamp,
	CONSTRAINT "alquiler_detalle_alquiler_id_fkey" FOREIGN KEY ("alquiler_id") REFERENCES "alquileres"("id") ON DELETE CASCADE,
	CONSTRAINT "alquiler_detalle_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE RESTRICT,
	CONSTRAINT "alquiler_detalle_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "conductores"("id") ON DELETE RESTRICT
);

-- 3. Create Alquiler Historial Table
CREATE TABLE IF NOT EXISTS "alquiler_historial" (
	"id" serial PRIMARY KEY NOT NULL,
	"alquiler_id" integer NOT NULL,
	"vehiculo_id" integer,
	"tipo_accion" "alquiler_historial_accion" NOT NULL,
	"monto_anterior" numeric(10, 2),
	"monto_nuevo" numeric(10, 2),
	"motivo" varchar(500),
	"fecha_accion" timestamp DEFAULT now() NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp DEFAULT now() NOT NULL,
	"eliminado_en" timestamp,
	CONSTRAINT "alquiler_historial_alquiler_id_fkey" FOREIGN KEY ("alquiler_id") REFERENCES "alquileres"("id") ON DELETE CASCADE,
	CONSTRAINT "alquiler_historial_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE RESTRICT
);

-- 4. Alter Alquileres Table (Master)
ALTER TABLE "alquileres" ADD COLUMN IF NOT EXISTS "es_indefinido" boolean DEFAULT false NOT NULL;

-- Remove vehicle-specific columns from Master
ALTER TABLE "alquileres" DROP COLUMN IF EXISTS "vehiculo_id";
ALTER TABLE "alquileres" DROP COLUMN IF EXISTS "conductor_id";
ALTER TABLE "alquileres" DROP COLUMN IF EXISTS "tipo";
ALTER TABLE "alquileres" DROP COLUMN IF EXISTS "kilometraje_inicial";
ALTER TABLE "alquileres" DROP COLUMN IF EXISTS "kilometraje_final";
ALTER TABLE "alquileres" DROP COLUMN IF EXISTS "monto";

-- Note: razon, observaciones, monto_por_dia, monto_total_final, fecha_inicio, fecha_fin are KEPT in the Master.

DO $$ BEGIN
  CREATE TYPE alquiler_tipo AS ENUM ('maquina_seca', 'maquina_operada');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE alquileres
ADD COLUMN IF NOT EXISTS cliente_id integer,
ADD COLUMN IF NOT EXISTS conductor_id integer,
ADD COLUMN IF NOT EXISTS tipo alquiler_tipo DEFAULT 'maquina_seca',
ADD COLUMN IF NOT EXISTS kilometraje_inicial numeric(12, 2),
ADD COLUMN IF NOT EXISTS kilometraje_final numeric(12, 2),
ADD COLUMN IF NOT EXISTS monto_por_dia numeric(10, 2),
ADD COLUMN IF NOT EXISTS monto_total_final numeric(10, 2),
ADD COLUMN IF NOT EXISTS razon varchar(500);

-- Backfill inicial para evitar nulls en registros existentes.
UPDATE alquileres
SET kilometraje_inicial = COALESCE(kilometraje_inicial, 0),
    monto_por_dia = COALESCE(monto_por_dia, COALESCE(monto, 0)),
    tipo = COALESCE(tipo, 'maquina_seca')
WHERE kilometraje_inicial IS NULL
   OR monto_por_dia IS NULL
   OR tipo IS NULL;

ALTER TABLE alquileres
ALTER COLUMN tipo SET NOT NULL,
ALTER COLUMN kilometraje_inicial SET NOT NULL,
ALTER COLUMN monto_por_dia SET NOT NULL;

DO $$
DECLARE
  default_cliente_id integer;
  null_clientes_count integer;
BEGIN
  SELECT id INTO default_cliente_id FROM clientes ORDER BY id LIMIT 1;

  IF default_cliente_id IS NOT NULL THEN
    UPDATE alquileres
    SET cliente_id = default_cliente_id
    WHERE cliente_id IS NULL;
  END IF;

  SELECT COUNT(*) INTO null_clientes_count FROM alquileres WHERE cliente_id IS NULL;
  IF null_clientes_count = 0 THEN
    ALTER TABLE alquileres ALTER COLUMN cliente_id SET NOT NULL;
  END IF;
END $$;

DO $$ BEGIN
  ALTER TABLE alquileres
    ADD CONSTRAINT alquileres_cliente_id_clientes_id_fk
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON DELETE RESTRICT ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE alquileres
    ADD CONSTRAINT alquileres_conductor_id_conductores_id_fk
    FOREIGN KEY (conductor_id) REFERENCES conductores(id)
    ON DELETE RESTRICT ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS alquileres_cliente_id_idx ON alquileres (cliente_id);
CREATE INDEX IF NOT EXISTS alquileres_conductor_id_idx ON alquileres (conductor_id);
CREATE INDEX IF NOT EXISTS alquileres_tipo_idx ON alquileres (tipo);

DO $$ BEGIN
  CREATE TYPE alquiler_documentos_tipo AS ENUM (
    'contrato',
    'guia_remision',
    'acta_entrega',
    'acta_devolucion',
    'comprobante_pago',
    'otros'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS alquiler_documentos (
  id serial PRIMARY KEY,
  alquiler_id integer NOT NULL,
  tipo alquiler_documentos_tipo DEFAULT 'otros' NOT NULL,
  nombre text NOT NULL,
  url text NOT NULL,
  creado_en timestamp DEFAULT now() NOT NULL,
  actualizado_en timestamp DEFAULT now() NOT NULL
);

DO $$ BEGIN
  ALTER TABLE alquiler_documentos
    ADD CONSTRAINT alquiler_documentos_alquiler_id_alquileres_id_fk
    FOREIGN KEY (alquiler_id) REFERENCES alquileres(id)
    ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS alquiler_documentos_alquiler_id_idx ON alquiler_documentos (alquiler_id);
CREATE INDEX IF NOT EXISTS alquiler_documentos_tipo_idx ON alquiler_documentos (tipo);

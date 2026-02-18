-- Migración: Actualizar Enum Documentos Vehículo
-- Fecha: 2026-02-13
-- Descripción: Eliminar 'certificado_tacos' y agregar 'revision_gps'

-- 1. Renombrar el tipo existente para backup
ALTER TYPE "vehiculo_documentos_tipo" RENAME TO "vehiculo_documentos_tipo_old";

-- 2. Crear el nuevo tipo con los valores actualizados
CREATE TYPE "vehiculo_documentos_tipo" AS ENUM(
  'tarjeta_propiedad',
  'tarjeta_unica_circulacion',
  'citv',
  'soat',
  'poliza',
  'certificado_operatividad_factura',
  'plan_mantenimiento_historico',
  'certificado_instalacion_gps',
  'certificado_valor_anadido',
  'constancia_gps',
  -- 'certificado_tacos' ELIMINADO
  'certificado_extintores_hidrostatica',
  'certificado_norma_r66',
  'certificado_laminados_lunas',
  'certificado_carroceria',
  'certificado_caracteristicas_tecnicas',
  'certificado_adas',
  'revision_gps', -- AÑADIDO
  'otros'
);

-- 3. Actualizar la tabla para usar el nuevo tipo
-- IMPORTANTE: Los registros que tengan 'certificado_tacos' se migrarán a 'otros' para evitar pérdida de datos o errores.
ALTER TABLE "vehiculo_documentos"
  ALTER COLUMN "tipo" TYPE "vehiculo_documentos_tipo"
  USING (
    CASE
      WHEN "tipo"::text = 'certificado_tacos' THEN 'otros'::vehiculo_documentos_tipo
      ELSE "tipo"::text::vehiculo_documentos_tipo
    END
  );

-- 4. Eliminar el tipo antiguo
DROP TYPE "vehiculo_documentos_tipo_old";

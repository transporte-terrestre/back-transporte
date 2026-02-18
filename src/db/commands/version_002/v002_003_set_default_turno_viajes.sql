-- Establecer turno por defecto (solo si es NULL)
UPDATE viajes 
SET turno = 'dia'
WHERE turno IS NULL 
  AND eliminado_en IS NULL;

-- Establecer numero_vale autoincremental (solo si es NULL)
UPDATE viajes 
SET numero_vale = LPAD(sub.row_num::text, 6, '0')
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as row_num
    FROM viajes 
    WHERE numero_vale IS NULL AND eliminado_en IS NULL
) sub
WHERE viajes.id = sub.id
  AND viajes.numero_vale IS NULL 
  AND viajes.eliminado_en IS NULL;

-- Verificar
SELECT id, fecha_salida, estado, turno, numero_vale
FROM viajes 
WHERE eliminado_en IS NULL
ORDER BY fecha_salida DESC;


-- Contraseña por defecto para conductores
-- Hash de "123456"

UPDATE conductores 
SET contrasenia = '$2b$10$LVbX2ZUITjJjS4RSplHXE.6ItDFZqOMWtCGx5iZBwi3zdZv4DvnOq'
WHERE contrasenia IS NULL 
  AND eliminado_en IS NULL;

-- Verificar
SELECT id, dni, nombres, apellidos, 
       CASE WHEN contrasenia IS NOT NULL THEN 'SI' ELSE 'NO' END as tiene_contrasenia
FROM conductores 
WHERE eliminado_en IS NULL;

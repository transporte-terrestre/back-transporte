-- Crear ruta_paradas desde rutas (origen=1, destino=2)

-- Paradas ORIGEN
INSERT INTO ruta_paradas (ruta_id, orden, nombre, ubicacion_lat, ubicacion_lng, distancia_previa_parada, creado_en, actualizado_en)
SELECT r.id, 1, r.origen, r.origen_lat, r.origen_lng, NULL, NOW(), NOW()
FROM rutas r
WHERE r.eliminado_en IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM ruta_paradas rp 
    WHERE rp.ruta_id = r.id AND rp.orden = 1 AND rp.eliminado_en IS NULL
  );

-- Paradas DESTINO
INSERT INTO ruta_paradas (ruta_id, orden, nombre, ubicacion_lat, ubicacion_lng, distancia_previa_parada, creado_en, actualizado_en)
SELECT r.id, 2, r.destino, r.destino_lat, r.destino_lng, r.distancia, NOW(), NOW()
FROM rutas r
WHERE r.eliminado_en IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM ruta_paradas rp 
    WHERE rp.ruta_id = r.id AND rp.orden = 2 AND rp.eliminado_en IS NULL
  );

-- Verificar
SELECT r.id, r.origen, r.destino, COUNT(rp.id) as paradas
FROM rutas r
LEFT JOIN ruta_paradas rp ON rp.ruta_id = r.id AND rp.eliminado_en IS NULL
WHERE r.eliminado_en IS NULL
GROUP BY r.id, r.origen, r.destino;

-- Insertar items del catálogo de checklist

-- Sección CONDUCTOR
INSERT INTO checklist_items (seccion, nombre, descripcion, orden, activo) VALUES
('conductor', 'Reporte diario', 'Bitácora actualizada', 1, true),
('conductor', 'IPERC continuo', 'Identificación de peligros', 2, true),
('conductor', 'Hoja de inspección', 'Pre-uso del vehículo', 3, true),
('conductor', 'Manifiesto de pasajeros', 'Lista completa', 4, true);

-- Sección SUPERVISIÓN
INSERT INTO checklist_items (seccion, nombre, descripcion, orden, activo) VALUES
('supervision', 'Inspección de documentos', 'Vigencia y validez', 1, true),
('supervision', 'Luces de emergencia y alarmas', 'Funcionamiento correcto', 2, true),
('supervision', 'Cinturones de seguridad', 'Estado y anclajes', 3, true),
('supervision', 'Inspección de herramientas', 'Kit completo', 4, true),
('supervision', 'Inspección de botiquines', 'Contenido completo', 5, true),
('supervision', 'Kit anti derrames', 'Disponibilidad', 6, true),
('supervision', 'Revisión de vehículos', 'Estado general', 7, true);

-- Verificar
SELECT id, seccion, nombre, descripcion, orden FROM checklist_items ORDER BY seccion, orden;

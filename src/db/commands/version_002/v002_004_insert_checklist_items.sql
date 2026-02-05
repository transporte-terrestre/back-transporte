-- Insertar items del catálogo de checklist
-- Incluye campo ORDEN. Seccion y Activo removidos.

INSERT INTO checklist_items (nombre, descripcion, orden) VALUES
-- CONDUCTOR
('IPERC continuo', 'Identificación de peligros (Sección Conductor)', 1),
('Hoja de inspección', 'Pre-uso del vehículo (Sección Conductor)', 2),

-- SUPERVISION
('Inspección de documentos', 'Vigencia y validez (Sección Supervisión)', 3),
('Luces de emergencia y alarmas', 'Funcionamiento correcto (Sección Supervisión)', 4),
('Cinturones de seguridad', 'Estado y anclajes (Sección Supervisión)', 5),
('Inspección de herramientas', 'Kit completo (Sección Supervisión)', 6),
('Inspección de botiquines', 'Contenido completo (Sección Supervisión)', 7),
('Kit anti derrames', 'Disponibilidad (Sección Supervisión)', 8),
('Revisión de vehículos', 'Estado general (Sección Supervisión)', 9);

-- Verificar
SELECT * FROM checklist_items ORDER BY orden;

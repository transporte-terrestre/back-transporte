-- Función para notificar cambios en kilometraje
CREATE OR REPLACE FUNCTION fn_notificar_cambio_mantenimiento()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo notificar si cambió el kilometraje o el intervalo de mantenimiento
    IF (OLD.kilometraje IS DISTINCT FROM NEW.kilometraje OR 
        OLD.kilometraje_mantenimiento IS DISTINCT FROM NEW.kilometraje_mantenimiento) THEN
        PERFORM pg_notify('vehiculo_mantenimiento_channel', NEW.id::text);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para la tabla vehiculos
DROP TRIGGER IF EXISTS trg_vehiculos_cambio_mantenimiento ON vehiculos;
CREATE TRIGGER trg_vehiculos_cambio_mantenimiento
AFTER UPDATE ON vehiculos
FOR EACH ROW
EXECUTE FUNCTION fn_notificar_cambio_mantenimiento();

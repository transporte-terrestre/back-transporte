-- Crear enum para tipo de movimiento si no existe
DO $$ BEGIN
    CREATE TYPE tipo_movimiento_pasajero AS ENUM ('entrada', 'salida');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Crear tabla de movimientos de pasajeros
CREATE TABLE IF NOT EXISTS viaje_pasajero_movimientos (
    id SERIAL PRIMARY KEY,
    viaje_pasajero_id INTEGER NOT NULL REFERENCES viaje_pasajeros(id) ON DELETE CASCADE,
    viaje_servicio_id INTEGER NOT NULL REFERENCES viaje_servicios(id) ON DELETE CASCADE,
    tipo_movimiento tipo_movimiento_pasajero NOT NULL DEFAULT 'entrada',
    creado_en TIMESTAMP DEFAULT NOW() NOT NULL,
    actualizado_en TIMESTAMP DEFAULT NOW() NOT NULL,
    eliminado_en TIMESTAMP
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS viaje_pasajero_movimientos_viaje_pasajero_id_idx ON viaje_pasajero_movimientos(viaje_pasajero_id);
CREATE INDEX IF NOT EXISTS viaje_pasajero_movimientos_viaje_servicio_id_idx ON viaje_pasajero_movimientos(viaje_servicio_id);

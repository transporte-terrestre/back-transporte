-- Migration for adding 'circuito' to viajes_sentido and metadata to viajes table
ALTER TYPE viajes_sentido ADD VALUE IF NOT EXISTS 'circuito';

ALTER TABLE viajes ADD COLUMN IF NOT EXISTS metadata JSONB;

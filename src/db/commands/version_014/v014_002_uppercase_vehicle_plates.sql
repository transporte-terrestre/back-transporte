UPDATE vehiculos SET placa = UPPER(placa) WHERE placa IS NOT NULL;
UPDATE vehiculos SET placa_anterior = UPPER(placa_anterior) WHERE placa_anterior IS NOT NULL;

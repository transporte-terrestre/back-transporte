import { Module } from '@nestjs/common';
import { RutasService } from './rutas.service';
import { RutasController } from './rutas.controller';
import { RutaRepository } from '@repository/ruta.repository';
import { RutaParadaRepository } from '@repository/ruta-parada.repository';
import { RutaCircuitoRepository } from '@repository/ruta-circuito.repository';

@Module({
  controllers: [RutasController],
  providers: [RutasService, RutaRepository, RutaParadaRepository, RutaCircuitoRepository],
  exports: [RutaParadaRepository],
})
export class RutasModule {}

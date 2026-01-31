import { Module } from '@nestjs/common';
import { RutasService } from './rutas.service';
import { RutasController } from './rutas.controller';
import { RutaRepository } from '@repository/ruta.repository';
import { RutaParadaRepository } from '@repository/ruta-parada.repository';

@Module({
  controllers: [RutasController],
  providers: [RutasService, RutaRepository, RutaParadaRepository],
  exports: [RutaParadaRepository],
})
export class RutasModule {}

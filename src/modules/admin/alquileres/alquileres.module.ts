import { Module } from '@nestjs/common';
import { AlquileresController } from './alquileres.controller';
import { AlquileresService } from './alquileres.service';
import { AlquilerRepository } from '@repository/alquiler.repository';
import { AlquilerDocumentoRepository } from '@repository/alquiler-documento.repository';

import { VehiculoRepository } from '@repository/vehiculo.repository';

@Module({
  controllers: [AlquileresController],
  providers: [AlquileresService, AlquilerRepository, AlquilerDocumentoRepository, VehiculoRepository],
  exports: [AlquileresService],
})
export class AlquileresModule {}

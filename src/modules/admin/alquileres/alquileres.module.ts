import { Module } from '@nestjs/common';
import { AlquileresController } from './alquileres.controller';
import { AlquileresService } from './alquileres.service';
import { AlquilerRepository } from '@repository/alquiler.repository';
import { AlquilerDocumentoRepository } from '@repository/alquiler-documento.repository';
import { VehiculoRepository } from '@repository/vehiculo.repository';
import { MantenimientoRepository } from '@repository/mantenimiento.repository';
import { ViajeRepository } from '@repository/viaje.repository';
import { VehiculoDocumentoRepository } from '@repository/vehiculo-documento.repository';

@Module({
  controllers: [AlquileresController],
  providers: [
    AlquileresService,
    AlquilerRepository,
    AlquilerDocumentoRepository,
    VehiculoRepository,
    MantenimientoRepository,
    ViajeRepository,
    VehiculoDocumentoRepository,
  ],
  exports: [AlquileresService],
})
export class AlquileresModule {}

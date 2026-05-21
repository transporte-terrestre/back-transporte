import { Module } from '@nestjs/common';
import { AbastecimientosController } from './abastecimientos.controller';
import { AbastecimientosService } from './abastecimientos.service';
import { VehiculoAbastecimientoRepository } from '@repository/vehiculo-abastecimiento.repository';
import { VehiculoRepository } from '@repository/vehiculo.repository';
import { ViajeTramoRepository } from '@repository/viaje-tramo.repository';

@Module({
  controllers: [AbastecimientosController],
  providers: [AbastecimientosService, VehiculoAbastecimientoRepository, VehiculoRepository, ViajeTramoRepository],
  exports: [VehiculoAbastecimientoRepository],
})
export class AbastecimientosModule {}

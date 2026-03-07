import { Module } from '@nestjs/common';
import { MantenimientosService } from './mantenimientos.service';
import { MantenimientosController } from './mantenimientos.controller';
import { MantenimientoRepository } from '@repository/mantenimiento.repository';
import { TareaRepository } from '@repository/tarea.repository';
import { VehiculoRepository } from '@repository/vehiculo.repository';

@Module({
  controllers: [MantenimientosController],
  providers: [MantenimientosService, MantenimientoRepository, TareaRepository, VehiculoRepository],
})
export class MantenimientosModule {}

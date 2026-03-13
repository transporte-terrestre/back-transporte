import { Module } from '@nestjs/common';
import { MantenimientosService } from './mantenimientos.service';
import { MantenimientosListenerService } from './mantenimientos-listener.service';
import { MantenimientosController } from './mantenimientos.controller';
import { MantenimientoRepository } from '@repository/mantenimiento.repository';
import { TareaRepository } from '@repository/tarea.repository';
import { VehiculoRepository } from '@repository/vehiculo.repository';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';

@Module({
  imports: [NotificacionesModule],
  controllers: [MantenimientosController],
  providers: [
    MantenimientosService,
    MantenimientosListenerService,
    MantenimientoRepository,
    TareaRepository,
    VehiculoRepository,
  ],
  exports: [MantenimientosService, MantenimientoRepository],
})
export class MantenimientosModule {}

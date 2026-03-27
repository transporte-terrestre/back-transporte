import { Module } from '@nestjs/common';
import { NotificacionesController } from './notificaciones.controller';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionRepository } from '@repository/notificacion.repository';
import { TeamsNotifierService } from '../../../services/teams-notifier.service';

@Module({
  controllers: [NotificacionesController],
  providers: [NotificacionesService, NotificacionRepository, TeamsNotifierService],
  exports: [NotificacionesService, TeamsNotifierService],
})
export class NotificacionesModule {}

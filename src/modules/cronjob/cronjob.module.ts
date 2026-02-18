import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobService } from './cronjob.service';
import { NotificacionesModule } from '../admin/notificaciones/notificaciones.module';

@Module({
  imports: [ScheduleModule.forRoot(), NotificacionesModule],
  providers: [CronjobService],
})
export class CronjobModule {}

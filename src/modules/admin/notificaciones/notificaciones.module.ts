import { Module } from "@nestjs/common";
import { NotificacionesController } from "./notificaciones.controller";
import { NotificacionesService } from "./notificaciones.service";
import { NotificacionRepository } from "@repository/notificacion.repository";

@Module({
  controllers: [NotificacionesController],
  providers: [NotificacionesService, NotificacionRepository],
  exports: [NotificacionesService],
})
export class NotificacionesModule {}

import { Module } from "@nestjs/common";
import { MantenimientosService } from "./mantenimientos.service";
import { MantenimientosController } from "./mantenimientos.controller";
import { MantenimientoRepository } from "@repositories/mantenimiento.repository";

@Module({
  controllers: [MantenimientosController],
  providers: [MantenimientosService, MantenimientoRepository],
})
export class MantenimientosModule {}

import { Module } from "@nestjs/common";
import { VehiculosService } from "./vehiculos.service";
import { VehiculosController } from "./vehiculos.controller";
import { VehiculoRepository } from "@repository/vehiculo.repository";

@Module({
  controllers: [VehiculosController],
  providers: [VehiculosService, VehiculoRepository],
})
export class VehiculosModule {}

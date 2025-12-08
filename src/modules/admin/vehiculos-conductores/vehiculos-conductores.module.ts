import { Module } from "@nestjs/common";
import { VehiculosConductoresService } from "./vehiculos-conductores.service";
import { VehiculosConductoresController } from "./vehiculos-conductores.controller";
import { VehiculoConductorRepository } from "@repository/vehiculo-conductor.repository";

@Module({
  controllers: [VehiculosConductoresController],
  providers: [VehiculosConductoresService, VehiculoConductorRepository],
})
export class VehiculosConductoresModule {}

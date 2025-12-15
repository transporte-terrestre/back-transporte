import { Module } from "@nestjs/common";
import { VehiculosService } from "./vehiculos.service";
import { VehiculosController } from "./vehiculos.controller";
import { VehiculoRepository } from "@repository/vehiculo.repository";
import { VehiculoDocumentoRepository } from "@repository/vehiculo-documento.repository";

@Module({
  controllers: [VehiculosController],
  providers: [VehiculosService, VehiculoRepository, VehiculoDocumentoRepository],
})
export class VehiculosModule {}

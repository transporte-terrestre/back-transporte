import { Module } from "@nestjs/common";
import { ViajesService } from "./viajes.service";
import { ViajesController } from "./viajes.controller";
import { ViajeRepository } from "@repository/viaje.repository";

@Module({
  controllers: [ViajesController],
  providers: [ViajesService, ViajeRepository],
})
export class ViajesModule {}

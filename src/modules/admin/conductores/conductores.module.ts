import { Module } from "@nestjs/common";
import { ConductoresService } from "./conductores.service";
import { ConductoresController } from "./conductores.controller";
import { ConductorRepository } from "@repositories/conductor.repository";

@Module({
  controllers: [ConductoresController],
  providers: [ConductoresService, ConductorRepository],
})
export class ConductoresModule {}

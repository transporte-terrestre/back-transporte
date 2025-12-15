import { Module } from "@nestjs/common";
import { ConductoresService } from "./conductores.service";
import { ConductoresController } from "./conductores.controller";
import { ConductorRepository } from "@repository/conductor.repository";
import { ConductorDocumentoRepository } from "@repository/conductor-documento.repository";

@Module({
  controllers: [ConductoresController],
  providers: [ConductoresService, ConductorRepository, ConductorDocumentoRepository],
})
export class ConductoresModule {}

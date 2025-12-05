import { Module } from "@nestjs/common";
import { RutasService } from "./rutas.service";
import { RutasController } from "./rutas.controller";
import { RutaRepository } from "@repositories/ruta.repository";

@Module({
  controllers: [RutasController],
  providers: [RutasService, RutaRepository],
})
export class RutasModule {}

import { Module } from "@nestjs/common";
import { ReportesController } from "./reportes.controller";
import { ReportesService } from "./reportes.service";
import { ReportesRepository } from "@repository/reportes.repository";

@Module({
  controllers: [ReportesController],
  providers: [ReportesService, ReportesRepository],
})
export class ReportesModule {}

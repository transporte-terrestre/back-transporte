import { Module } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { DashboardController } from "./dashboard.controller";
import { ClienteRepository } from "@repository/cliente.repository";
import { DashboardRepository } from "@repository/dashboard.repository";
import { ReportesRepository } from "@repository/reportes.repository";

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository],
})
export class DashboardModule {}

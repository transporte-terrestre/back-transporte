import { Module } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { DashboardController } from "./dashboard.controller";
import { VehiculoRepository } from "@repository/vehiculo.repository";
import { ConductorRepository } from "@repository/conductor.repository";
import { ClienteRepository } from "@repository/cliente.repository";
import { ViajeRepository } from "@repository/viaje.repository";
import { MantenimientoRepository } from "@repository/mantenimiento.repository";
import { RutaRepository } from "@repository/ruta.repository";

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    VehiculoRepository,
    ConductorRepository,
    ClienteRepository,
    ViajeRepository,
    MantenimientoRepository,
    RutaRepository,
  ],
})
export class DashboardModule {}

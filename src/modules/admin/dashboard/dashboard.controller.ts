import { Controller, Get, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { DashboardService } from "./dashboard.service";
import { DashboardStatsDto } from "./dto/dashboard-stats.dto";
import { VehiculosPorEstadoDto } from "./dto/vehiculos-estado.dto";
import { ViajesRecientesDto } from "./dto/viajes-recientes.dto";
import { MantenimientosProximosDto } from "./dto/mantenimientos-proximos.dto";
import { RutasPopularesDto } from "./dto/rutas-populares.dto";
import { IngresosMensualesDto } from "./dto/ingresos-mensuales.dto";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("dashboard")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("stats")
  @ApiOperation({ summary: "Obtener estadísticas generales del dashboard" })
  @ApiResponse({ status: 200, type: DashboardStatsDto })
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get("vehiculos-estado")
  @ApiOperation({ summary: "Obtener vehículos agrupados por estado" })
  @ApiResponse({ status: 200, type: VehiculosPorEstadoDto })
  getVehiculosPorEstado() {
    return this.dashboardService.getVehiculosPorEstado();
  }

  @Get("viajes-recientes")
  @ApiOperation({ summary: "Obtener los últimos 5 viajes" })
  @ApiResponse({ status: 200, type: ViajesRecientesDto })
  getViajesRecientes() {
    return this.dashboardService.getViajesRecientes();
  }

  @Get("mantenimientos-proximos")
  @ApiOperation({ summary: "Obtener mantenimientos programados próximos" })
  @ApiResponse({ status: 200, type: MantenimientosProximosDto })
  getMantenimientosProximos() {
    return this.dashboardService.getMantenimientosProximos();
  }

  @Get("rutas-populares")
  @ApiOperation({ summary: "Obtener las 5 rutas más utilizadas" })
  @ApiResponse({ status: 200, type: RutasPopularesDto })
  getRutasPopulares() {
    return this.dashboardService.getRutasPopulares();
  }

  @Get("ingresos-mensuales")
  @ApiOperation({ summary: "Obtener ingresos de los últimos 6 meses" })
  @ApiResponse({ status: 200, type: IngresosMensualesDto })
  getIngresosMensuales() {
    return this.dashboardService.getIngresosMensuales();
  }
}

import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ReportesService } from "./reportes.service";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { ReporteQueryDto } from "./dto/reporte-query.dto";
import { ReporteViajesVehiculoDto } from "./dto/reporte-viajes-vehiculo.dto";
import { ReporteViajesConductorDto } from "./dto/reporte-viajes-conductor.dto";
import { ReporteKilometrajeVehiculoDto } from "./dto/reporte-kilometraje-vehiculo.dto";
import { ReporteDetalladoQueryDto } from "./dto/reporte-detallado-query.dto";
import { ViajeDetalladoDto } from "./dto/viaje-detallado.dto";

@ApiTags("Reportes")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("reportes")
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  // ========== RESÚMENES (Estadísticas Agregadas) ==========

  @Get("viajes-vehiculo")
  @ApiOperation({ summary: "Reporte de cantidad de viajes por vehículo" })
  @ApiResponse({ type: [ReporteViajesVehiculoDto] })
  async getViajesPorVehiculo(@Query() query: ReporteQueryDto) {
    return await this.reportesService.getViajesPorVehiculo(
      query.fechaInicio,
      query.fechaFin
    );
  }

  @Get("viajes-conductor")
  @ApiOperation({ summary: "Reporte de cantidad de viajes por conductor" })
  @ApiResponse({ type: [ReporteViajesConductorDto] })
  async getViajesPorConductor(@Query() query: ReporteQueryDto) {
    return await this.reportesService.getViajesPorConductor(
      query.fechaInicio,
      query.fechaFin
    );
  }

  @Get("kilometraje-vehiculo")
  @ApiOperation({
    summary:
      "Reporte de kilometraje total (rutas fijas completadas) por vehículo",
  })
  @ApiResponse({ type: [ReporteKilometrajeVehiculoDto] })
  async getKilometrajePorVehiculo(@Query() query: ReporteQueryDto) {
    return await this.reportesService.getKilometrajePorVehiculo(
      query.fechaInicio,
      query.fechaFin
    );
  }

  // ========== REPORTES DETALLADOS (Viajes específicos) ==========

  @Get("viajes-detallados/vehiculo/:id")
  @ApiOperation({ summary: "Viajes detallados de un vehículo específico" })
  @ApiParam({ name: "id", description: "ID del vehículo" })
  @ApiResponse({ type: [ViajeDetalladoDto] })
  async getViajesDetalladosPorVehiculo(
    @Param("id", ParseIntPipe) id: number,
    @Query() query: ReporteDetalladoQueryDto
  ) {
    return await this.reportesService.getViajesDetalladosPorVehiculo(
      id,
      query.fechaInicio,
      query.fechaFin
    );
  }

  @Get("viajes-detallados/conductor/:id")
  @ApiOperation({ summary: "Viajes detallados de un conductor específico" })
  @ApiParam({ name: "id", description: "ID del conductor" })
  @ApiResponse({ type: [ViajeDetalladoDto] })
  async getViajesDetalladosPorConductor(
    @Param("id", ParseIntPipe) id: number,
    @Query() query: ReporteDetalladoQueryDto
  ) {
    return await this.reportesService.getViajesDetalladosPorConductor(
      id,
      query.fechaInicio,
      query.fechaFin
    );
  }

  @Get("viajes-detallados/cliente/:id")
  @ApiOperation({ summary: "Viajes detallados de un cliente específico" })
  @ApiParam({ name: "id", description: "ID del cliente" })
  @ApiResponse({ type: [ViajeDetalladoDto] })
  async getViajesDetalladosPorCliente(
    @Param("id", ParseIntPipe) id: number,
    @Query() query: ReporteDetalladoQueryDto
  ) {
    return await this.reportesService.getViajesDetalladosPorCliente(
      id,
      query.fechaInicio,
      query.fechaFin
    );
  }
}

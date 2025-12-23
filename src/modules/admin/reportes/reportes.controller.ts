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
import { ReporteDetalladoQueryDto } from "./dto/reporte-detallado-query.dto";
import { ViajeDetalladoDto } from "./dto/viaje-detallado.dto";
import { MantenimientoDetalladoVehiculoDto } from "./dto/mantenimiento-detallado-vehiculo.dto";
import { MantenimientoDetalladoTallerDto } from "./dto/mantenimiento-detallado-taller.dto";

@ApiTags("Reportes")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("reportes")
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

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

  // ========== REPORTES MANTENIMIENTOS ==========

  @Get("mantenimientos-detallados/vehiculo/:id")
  @ApiOperation({
    summary: "Mantenimientos detallados de un vehículo específico",
  })
  @ApiParam({ name: "id", description: "ID del vehículo" })
  @ApiResponse({ type: [MantenimientoDetalladoVehiculoDto] })
  async getMantenimientosDetalladosPorVehiculo(
    @Param("id", ParseIntPipe) id: number,
    @Query() query: ReporteDetalladoQueryDto
  ) {
    return await this.reportesService.getMantenimientosDetalladosPorVehiculo(
      id,
      query.fechaInicio,
      query.fechaFin
    );
  }

  @Get("mantenimientos-detallados/taller/:id")
  @ApiOperation({
    summary: "Mantenimientos detallados de un taller específico",
  })
  @ApiParam({ name: "id", description: "ID del taller" })
  @ApiResponse({ type: [MantenimientoDetalladoTallerDto] })
  async getMantenimientosDetalladosPorTaller(
    @Param("id", ParseIntPipe) id: number,
    @Query() query: ReporteDetalladoQueryDto
  ) {
    return await this.reportesService.getMantenimientosDetalladosPorTaller(
      id,
      query.fechaInicio,
      query.fechaFin
    );
  }
}

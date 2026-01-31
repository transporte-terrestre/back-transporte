import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ReporteDetalladoQueryDto } from './dto/reporte-detallado-query.dto';
import { ViajeDetalladoDto } from './dto/viaje-detallado.dto';
import { MantenimientoDetalladoVehiculoDto } from './dto/mantenimiento-detallado-vehiculo.dto';
import { MantenimientoDetalladoTallerDto } from './dto/mantenimiento-detallado-taller.dto';
import { ReporteConductorDto } from './dto/reporte-conductor.dto';

@ApiTags('reportes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  // ========== REPORTES DETALLADOS (Viajes específicos) ==========

  @Get('viajes-detallados/vehiculo/:id')
  @ApiOperation({ summary: 'Viajes detallados de un vehículo específico' })
  @ApiParam({ name: 'id', description: 'ID del vehículo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de viajes detallados',
    type: ViajeDetalladoDto,
    isArray: true,
  })
  async getViajesDetalladosPorVehiculo(@Param('id', ParseIntPipe) id: number, @Query() query: ReporteDetalladoQueryDto) {
    return await this.reportesService.getViajesDetalladosPorVehiculo(id, query.fechaInicio, query.fechaFin);
  }

  @Get('viajes-detallados/conductor/:id')
  @ApiOperation({ summary: 'Viajes detallados de un conductor específico' })
  @ApiParam({ name: 'id', description: 'ID del conductor' })
  @ApiResponse({
    status: 200,
    description: 'Lista de viajes detallados',
    type: ViajeDetalladoDto,
    isArray: true,
  })
  async getViajesDetalladosPorConductor(@Param('id', ParseIntPipe) id: number, @Query() query: ReporteDetalladoQueryDto) {
    return await this.reportesService.getViajesDetalladosPorConductor(id, query.fechaInicio, query.fechaFin);
  }

  @Get('viajes-detallados/cliente/:id')
  @ApiOperation({ summary: 'Viajes detallados de un cliente específico' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({
    status: 200,
    description: 'Lista de viajes detallados',
    type: ViajeDetalladoDto,
    isArray: true,
  })
  async getViajesDetalladosPorCliente(@Param('id', ParseIntPipe) id: number, @Query() query: ReporteDetalladoQueryDto) {
    return await this.reportesService.getViajesDetalladosPorCliente(id, query.fechaInicio, query.fechaFin);
  }

  // ========== REPORTES MANTENIMIENTOS ==========

  @Get('mantenimientos-detallados/vehiculo/:id')
  @ApiOperation({
    summary: 'Mantenimientos detallados de un vehículo específico',
  })
  @ApiParam({ name: 'id', description: 'ID del vehículo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de mantenimientos detallados',
    type: MantenimientoDetalladoVehiculoDto,
    isArray: true,
  })
  async getMantenimientosDetalladosPorVehiculo(@Param('id', ParseIntPipe) id: number, @Query() query: ReporteDetalladoQueryDto) {
    return await this.reportesService.getMantenimientosDetalladosPorVehiculo(id, query.fechaInicio, query.fechaFin);
  }

  @Get('mantenimientos-detallados/taller/:id')
  @ApiOperation({
    summary: 'Mantenimientos detallados de un taller específico',
  })
  @ApiParam({ name: 'id', description: 'ID del taller' })
  @ApiResponse({
    status: 200,
    description: 'Lista de mantenimientos detallados',
    type: MantenimientoDetalladoTallerDto,
    isArray: true,
  })
  async getMantenimientosDetalladosPorTaller(@Param('id', ParseIntPipe) id: number, @Query() query: ReporteDetalladoQueryDto) {
    return await this.reportesService.getMantenimientosDetalladosPorTaller(id, query.fechaInicio, query.fechaFin);
  }

  @Get('conductores/general')
  @ApiOperation({ summary: 'Reporte general de conductores con vencimientos' })
  @ApiResponse({
    status: 200,
    description: 'Lista general de conductores con vencimientos',
    type: ReporteConductorDto,
    isArray: true,
  })
  async getReporteConductores() {
    return await this.reportesService.getReporteConductores();
  }
}

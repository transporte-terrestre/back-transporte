import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AbastecimientosService } from './abastecimientos.service';
import { AbastecimientoCreateDto } from './dto/abastecimiento-create.dto';
import { AbastecimientoUpdateDto } from './dto/abastecimiento-update.dto';
import { AbastecimientoResultDto } from './dto/abastecimiento-result.dto';
import { AbastecimientoPaginationQueryDto, PaginatedAbastecimientoResultDto } from './dto/abastecimiento-pagination.dto';

@ApiTags('abastecimientos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('abastecimiento')
export class AbastecimientosController {
  constructor(private readonly abastecimientosService: AbastecimientosService) {}

  @Get('find-all')
  @ApiOperation({ summary: 'Obtener historial de abastecimientos con paginación y filtros' })
  @ApiResponse({ status: 200, type: PaginatedAbastecimientoResultDto })
  findAll(@Query() query: AbastecimientoPaginationQueryDto) {
    return this.abastecimientosService.findAllPaginated(query.page, query.limit, query.search, query.vehiculoId, query.viajeTramoId);
  }

  @Get('find-one/:id')
  @ApiOperation({ summary: 'Obtener un abastecimiento por ID' })
  @ApiParam({ name: 'id', description: 'ID del abastecimiento', type: Number })
  @ApiResponse({ status: 200, type: AbastecimientoResultDto })
  findOne(@Param('id') id: string) {
    return this.abastecimientosService.findOne(+id);
  }

  @Get('vehiculo/:vehiculoId')
  @ApiOperation({ summary: 'Obtener abastecimientos de un vehículo' })
  @ApiParam({ name: 'vehiculoId', description: 'ID del vehículo', type: Number })
  @ApiResponse({ status: 200, type: [AbastecimientoResultDto] })
  findByVehiculo(@Param('vehiculoId') vehiculoId: string) {
    return this.abastecimientosService.findByVehiculoId(+vehiculoId);
  }

  @Get('tramo/:viajeTramoId')
  @ApiOperation({ summary: 'Obtener abastecimientos asociados a un tramo' })
  @ApiParam({ name: 'viajeTramoId', description: 'ID del tramo', type: Number })
  @ApiResponse({ status: 200, type: [AbastecimientoResultDto] })
  findByTramo(@Param('viajeTramoId') viajeTramoId: string) {
    return this.abastecimientosService.findByViajeTramo(+viajeTramoId);
  }

  @Post('create')
  @ApiOperation({ summary: 'Registrar un abastecimiento de vehículo' })
  @ApiResponse({ status: 201, type: AbastecimientoResultDto })
  create(@Body() dto: AbastecimientoCreateDto) {
    return this.abastecimientosService.create(dto);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Actualizar un abastecimiento' })
  @ApiParam({ name: 'id', description: 'ID del abastecimiento', type: Number })
  @ApiResponse({ status: 200, type: AbastecimientoResultDto })
  update(@Param('id') id: string, @Body() dto: AbastecimientoUpdateDto) {
    return this.abastecimientosService.update(+id, dto);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Eliminar un abastecimiento' })
  @ApiParam({ name: 'id', description: 'ID del abastecimiento', type: Number })
  @ApiResponse({ status: 200, type: AbastecimientoResultDto })
  delete(@Param('id') id: string) {
    return this.abastecimientosService.delete(+id);
  }
}

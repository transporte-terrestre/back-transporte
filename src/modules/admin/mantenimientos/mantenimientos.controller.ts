import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MantenimientosService } from './mantenimientos.service';
import { MantenimientoCreateDto } from './dto/mantenimiento/mantenimiento-create.dto';
import { MantenimientoUpdateDto } from './dto/mantenimiento/mantenimiento-update.dto';
import { MantenimientoResultDto } from './dto/mantenimiento/mantenimiento-result.dto';
import { AuthGuard } from '@nestjs/passport';
import { MantenimientoPaginationQueryDto, PaginatedMantenimientoResultDto } from './dto/mantenimiento/mantenimiento-paginated.dto';
import { MantenimientoTareaCreateDto } from './dto/mantenimiento-tarea/mantenimiento-tarea-create.dto';
import { MantenimientoTareaUpdateDto } from './dto/mantenimiento-tarea/mantenimiento-tarea-update.dto';
import { MantenimientoTareaResultDto } from './dto/mantenimiento-tarea/mantenimiento-tarea-result.dto';
import { MantenimientoDocumentoCreateDto } from './dto/mantenimiento-documento/mantenimiento-documento-create.dto';
import { MantenimientoDocumentoUpdateDto } from './dto/mantenimiento-documento/mantenimiento-documento-update.dto';
import { MantenimientoDocumentoResultDto } from './dto/mantenimiento-documento/mantenimiento-documento-result.dto';
import { TareaCreateDto } from './dto/tarea/tarea-create.dto';
import { TareaUpdateDto } from './dto/tarea/tarea-update.dto';
import { TareaResultDto } from './dto/tarea/tarea-result.dto';
import { TareaPaginationQueryDto, PaginatedTareaResultDto } from './dto/tarea/tarea-paginated.dto';
import { MantenimientoReporteEstadoDto } from './dto/mantenimiento/mantenimiento-reporte-estado.dto';

@ApiTags('mantenimientos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('mantenimiento')
export class MantenimientosController {
  constructor(private readonly mantenimientosService: MantenimientosService) {}

  @Get('find-all')
  @ApiOperation({
    summary: 'Obtener mantenimientos con paginación, búsqueda y filtros',
    description: 'Busca por tipo, proveedor o descripción. Filtra por rango de fechas.',
  })
  @ApiResponse({ status: 200, type: PaginatedMantenimientoResultDto })
  findAll(@Query() query: MantenimientoPaginationQueryDto) {
    return this.mantenimientosService.findAllPaginated(
      query.page,
      query.limit,
      query.search,
      query.fechaInicio,
      query.fechaFin,
      query.tipo,
      query.estado,
    );
  }

  @Get('find-one/:id')
  @ApiOperation({ summary: 'Get a maintenance record by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Maintenance ID' })
  @ApiResponse({ status: 200, type: MantenimientoResultDto })
  findOne(@Param('id') id: string) {
    return this.mantenimientosService.findOne(+id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new maintenance record' })
  @ApiResponse({ status: 200, type: MantenimientoResultDto })
  create(@Body() createMantenimientoDto: MantenimientoCreateDto) {
    return this.mantenimientosService.create(createMantenimientoDto);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update a maintenance record' })
  @ApiParam({ name: 'id', type: 'number', description: 'Maintenance ID' })
  @ApiResponse({ status: 200, type: MantenimientoResultDto })
  update(@Param('id') id: string, @Body() updateMantenimientoDto: MantenimientoUpdateDto) {
    return this.mantenimientosService.update(+id, updateMantenimientoDto);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a maintenance record' })
  @ApiParam({ name: 'id', type: 'number', description: 'Maintenance ID' })
  @ApiResponse({ status: 200, type: MantenimientoResultDto })
  remove(@Param('id') id: string) {
    return this.mantenimientosService.delete(+id);
  }

  // ========== MANTENIMIENTO TAREAS (relación) ==========
  @Post('mantenimiento-tarea/create')
  @ApiOperation({ summary: 'Agregar una tarea a un mantenimiento' })
  @ApiResponse({ status: 201, type: MantenimientoTareaResultDto })
  createMantenimientoTarea(@Body() data: MantenimientoTareaCreateDto) {
    return this.mantenimientosService.createMantenimientoTarea(data);
  }

  @Patch('mantenimiento-tarea/update/:id')
  @ApiOperation({ summary: 'Actualizar una tarea de mantenimiento' })
  @ApiParam({
    name: 'id',
    description: 'ID de la relación tarea-mantenimiento',
    type: Number,
  })
  @ApiResponse({ status: 200, type: MantenimientoTareaResultDto })
  updateMantenimientoTarea(@Param('id') id: string, @Body() data: MantenimientoTareaUpdateDto) {
    return this.mantenimientosService.updateMantenimientoTarea(+id, data);
  }

  @Delete('mantenimiento-tarea/delete/:id')
  @ApiOperation({ summary: 'Eliminar una tarea de mantenimiento' })
  @ApiParam({
    name: 'id',
    description: 'ID de la relación tarea-mantenimiento',
    type: Number,
  })
  @ApiResponse({ status: 200, type: MantenimientoTareaResultDto })
  deleteMantenimientoTarea(@Param('id') id: string) {
    return this.mantenimientosService.deleteMantenimientoTarea(+id);
  }

  // ========== CATÁLOGO DE TAREAS ==========
  @Get('tarea/find-all')
  @ApiOperation({
    summary: 'Obtener tareas del catálogo con paginación y filtros',
  })
  @ApiResponse({ status: 200, type: PaginatedTareaResultDto })
  findAllTareas(@Query() query: TareaPaginationQueryDto) {
    return this.mantenimientosService.findAllTareasPaginated(query.page, query.limit, query.search);
  }

  @Get('tarea/find-one/:id')
  @ApiOperation({ summary: 'Obtener una tarea del catálogo por ID' })
  @ApiParam({ name: 'id', description: 'ID de la tarea', type: Number })
  @ApiResponse({ status: 200, type: TareaResultDto })
  findOneTarea(@Param('id') id: string) {
    return this.mantenimientosService.findOneTarea(+id);
  }

  @Post('tarea/create')
  @ApiOperation({ summary: 'Crear una nueva tarea en el catálogo' })
  @ApiResponse({ status: 201, type: TareaResultDto })
  createTarea(@Body() createDto: TareaCreateDto) {
    return this.mantenimientosService.createTarea(createDto);
  }

  @Patch('tarea/update/:id')
  @ApiOperation({ summary: 'Actualizar una tarea del catálogo' })
  @ApiParam({ name: 'id', description: 'ID de la tarea', type: Number })
  @ApiResponse({ status: 200, type: TareaResultDto })
  updateTarea(@Param('id') id: string, @Body() updateDto: TareaUpdateDto) {
    return this.mantenimientosService.updateTarea(+id, updateDto);
  }

  @Delete('tarea/delete/:id')
  @ApiOperation({ summary: 'Eliminar una tarea del catálogo' })
  @ApiParam({ name: 'id', description: 'ID de la tarea', type: Number })
  @ApiResponse({ status: 200, type: TareaResultDto })
  deleteTarea(@Param('id') id: string) {
    return this.mantenimientosService.deleteTarea(+id);
  }

  // ========== DOCUMENTOS ==========
  @Get('documento/:id')
  @ApiOperation({ summary: 'Obtener un documento por ID' })
  @ApiParam({ name: 'id', description: 'ID del documento', type: Number })
  @ApiResponse({ status: 200, type: MantenimientoDocumentoResultDto })
  findDocumento(@Param('id') id: string) {
    return this.mantenimientosService.findDocumento(+id);
  }

  @Post('documento/create')
  @ApiOperation({ summary: 'Agregar un documento a un mantenimiento' })
  @ApiResponse({ status: 201, type: MantenimientoDocumentoResultDto })
  createDocumento(@Body() data: MantenimientoDocumentoCreateDto) {
    return this.mantenimientosService.createDocumento(data);
  }

  @Patch('documento/update/:id')
  @ApiOperation({ summary: 'Actualizar un documento de mantenimiento' })
  @ApiParam({ name: 'id', description: 'ID del documento', type: Number })
  @ApiResponse({ status: 200, type: MantenimientoDocumentoResultDto })
  updateDocumento(@Param('id') id: string, @Body() data: MantenimientoDocumentoUpdateDto) {
    return this.mantenimientosService.updateDocumento(+id, data);
  }

  @Delete('documento/delete/:id')
  @ApiOperation({ summary: 'Eliminar un documento de mantenimiento' })
  @ApiParam({ name: 'id', description: 'ID del documento', type: Number })
  @ApiResponse({ status: 200, type: MantenimientoDocumentoResultDto })
  deleteDocumento(@Param('id') id: string) {
    return this.mantenimientosService.deleteDocumento(+id);
  }

  // ========== REPORTE DE ESTADO ==========
  @Get('reporte-estado-vehiculos')
  @ApiOperation({ summary: 'Obtener reporte de estado de mantenimiento de vehículos' })
  @ApiResponse({ status: 200, type: [MantenimientoReporteEstadoDto] })
  getReporteEstadoVehiculos() {
    return this.mantenimientosService.getReporteEstadoVehiculos();
  }
}

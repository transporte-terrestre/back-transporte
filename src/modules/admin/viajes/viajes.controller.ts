import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ViajesService } from './viajes.service';
import { ViajeCreateDto } from './dto/viaje-create.dto';
import { ViajeUpdateDto } from './dto/viaje-update.dto';
import { ViajeResultDto } from './dto/viaje-result.dto';
import { AuthGuard } from '@nestjs/passport';
import { ViajePaginationQueryDto, PaginatedViajeResultDto } from './dto/viaje-paginated.dto';
import { ViajeConductorCreateDto } from './dto/viaje-conductor-create.dto';
import { ViajeConductorUpdateDto } from './dto/viaje-conductor-update.dto';
import { ViajeConductorResultDto } from './dto/viaje-conductor-result.dto';
import { ViajeVehiculoCreateDto } from './dto/viaje-vehiculo-create.dto';
import { ViajeVehiculoUpdateDto } from './dto/viaje-vehiculo-update.dto';
import { ViajeVehiculoResultDto } from './dto/viaje-vehiculo-result.dto';
import { ViajeComentarioCreateDto } from './dto/viaje-comentario-create.dto';
import { ViajeComentarioUpdateDto } from './dto/viaje-comentario-update.dto';
import { ViajeComentarioResultDto } from './dto/viaje-comentario-result.dto';
import { ViajeServicioCreateDto } from './dto/viaje-servicio-create.dto';
import { ViajeServicioUpdateDto } from './dto/viaje-servicio-update.dto';
import { ViajeServicioResultDto } from './dto/viaje-servicio-result.dto';
import { ViajeServicioReordenarDto } from './dto/viaje-servicio-reordenar.dto';

@ApiTags('viajes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('viaje')
export class ViajesController {
  constructor(private readonly viajesService: ViajesService) {}

  @Get('find-all')
  @ApiOperation({
    summary: 'Obtener viajes con paginación, búsqueda y filtros',
    description:
      'Busca por estado, ruta ocasional y modalidad. Filtra por rango de fechas, modalidad de servicio y tipo de viaje (ocasional o regular).',
  })
  @ApiResponse({ status: 200, type: PaginatedViajeResultDto })
  findAll(@Query() query: ViajePaginationQueryDto) {
    return this.viajesService.findAllPaginated(
      query.page,
      query.limit,
      query.search,
      query.fechaInicio,
      query.fechaFin,
      query.modalidadServicio,
      query.tipoRuta,
      query.estado,
    );
  }

  @Get('find-one/:id')
  @ApiOperation({ summary: 'Get a trip by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Trip ID' })
  @ApiResponse({ status: 200, type: ViajeResultDto })
  findOne(@Param('id') id: string) {
    return this.viajesService.findOne(+id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new trip' })
  @ApiResponse({ status: 200, type: ViajeResultDto })
  create(@Body() createViajeDto: ViajeCreateDto) {
    return this.viajesService.create(createViajeDto);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update a trip' })
  @ApiParam({ name: 'id', type: 'number', description: 'Trip ID' })
  @ApiResponse({ status: 200, type: ViajeResultDto })
  update(@Param('id') id: string, @Body() updateViajeDto: ViajeUpdateDto) {
    return this.viajesService.update(+id, updateViajeDto);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a trip' })
  @ApiParam({ name: 'id', type: 'number', description: 'Trip ID' })
  @ApiResponse({ status: 200, type: ViajeResultDto })
  remove(@Param('id') id: string) {
    return this.viajesService.delete(+id);
  }

  // ========== CONDUCTORES ==========
  @Get(':viajeId/conductores')
  @ApiOperation({ summary: 'Obtener todos los conductores de un viaje' })
  @ApiParam({ name: 'viajeId', description: 'ID del viaje', type: Number })
  @ApiResponse({ status: 200, type: [ViajeConductorResultDto] })
  findConductores(@Param('viajeId') viajeId: string) {
    return this.viajesService.findConductores(+viajeId);
  }

  @Get(':viajeId/conductor/:conductorId')
  @ApiOperation({ summary: 'Obtener un conductor específico de un viaje' })
  @ApiParam({ name: 'viajeId', description: 'ID del viaje', type: Number })
  @ApiParam({
    name: 'conductorId',
    description: 'ID del conductor',
    type: Number,
  })
  @ApiResponse({ status: 200, type: ViajeConductorResultDto })
  findConductor(@Param('viajeId') viajeId: string, @Param('conductorId') conductorId: string) {
    return this.viajesService.findConductor(+viajeId, +conductorId);
  }

  @Post('conductor/assign')
  @ApiOperation({ summary: 'Asignar un conductor a un viaje' })
  @ApiResponse({ status: 201, type: ViajeConductorResultDto })
  assignConductor(@Body() createDto: ViajeConductorCreateDto) {
    return this.viajesService.assignConductor(createDto);
  }

  @Patch(':viajeId/conductor/:conductorId')
  @ApiOperation({ summary: 'Actualizar asignación de conductor' })
  @ApiParam({ name: 'viajeId', description: 'ID del viaje', type: Number })
  @ApiParam({
    name: 'conductorId',
    description: 'ID del conductor',
    type: Number,
  })
  @ApiResponse({ status: 200, type: ViajeConductorResultDto })
  updateConductor(@Param('viajeId') viajeId: string, @Param('conductorId') conductorId: string, @Body() updateDto: ViajeConductorUpdateDto) {
    return this.viajesService.updateConductor(+viajeId, +conductorId, updateDto);
  }

  @Delete(':viajeId/conductor/:conductorId')
  @ApiOperation({ summary: 'Remover conductor de un viaje' })
  @ApiParam({ name: 'viajeId', description: 'ID del viaje', type: Number })
  @ApiParam({
    name: 'conductorId',
    description: 'ID del conductor',
    type: Number,
  })
  @ApiResponse({ status: 200, type: ViajeConductorResultDto })
  removeConductor(@Param('viajeId') viajeId: string, @Param('conductorId') conductorId: string) {
    return this.viajesService.removeConductor(+viajeId, +conductorId);
  }

  // ========== VEHÍCULOS ==========
  @Get(':viajeId/vehiculos')
  @ApiOperation({ summary: 'Obtener todos los vehículos de un viaje' })
  @ApiParam({ name: 'viajeId', description: 'ID del viaje', type: Number })
  @ApiResponse({ status: 200, type: [ViajeVehiculoResultDto] })
  findVehiculos(@Param('viajeId') viajeId: string) {
    return this.viajesService.findVehiculos(+viajeId);
  }

  @Get(':viajeId/vehiculo/:vehiculoId')
  @ApiOperation({ summary: 'Obtener un vehículo específico de un viaje' })
  @ApiParam({ name: 'viajeId', description: 'ID del viaje', type: Number })
  @ApiParam({
    name: 'vehiculoId',
    description: 'ID del vehículo',
    type: Number,
  })
  @ApiResponse({ status: 200, type: ViajeVehiculoResultDto })
  findVehiculo(@Param('viajeId') viajeId: string, @Param('vehiculoId') vehiculoId: string) {
    return this.viajesService.findVehiculo(+viajeId, +vehiculoId);
  }

  @Post('vehiculo/assign')
  @ApiOperation({ summary: 'Asignar un vehículo a un viaje' })
  @ApiResponse({ status: 201, type: ViajeVehiculoResultDto })
  assignVehiculo(@Body() createDto: ViajeVehiculoCreateDto) {
    return this.viajesService.assignVehiculo(createDto);
  }

  @Patch(':viajeId/vehiculo/:vehiculoId')
  @ApiOperation({ summary: 'Actualizar asignación de vehículo' })
  @ApiParam({ name: 'viajeId', description: 'ID del viaje', type: Number })
  @ApiParam({
    name: 'vehiculoId',
    description: 'ID del vehículo',
    type: Number,
  })
  @ApiResponse({ status: 200, type: ViajeVehiculoResultDto })
  updateVehiculo(@Param('viajeId') viajeId: string, @Param('vehiculoId') vehiculoId: string, @Body() updateDto: ViajeVehiculoUpdateDto) {
    return this.viajesService.updateVehiculo(+viajeId, +vehiculoId, updateDto);
  }

  @Delete(':viajeId/vehiculo/:vehiculoId')
  @ApiOperation({ summary: 'Remover vehículo de un viaje' })
  @ApiParam({ name: 'viajeId', description: 'ID del viaje', type: Number })
  @ApiParam({
    name: 'vehiculoId',
    description: 'ID del vehículo',
    type: Number,
  })
  @ApiResponse({ status: 200, type: ViajeVehiculoResultDto })
  removeVehiculo(@Param('viajeId') viajeId: string, @Param('vehiculoId') vehiculoId: string) {
    return this.viajesService.removeVehiculo(+viajeId, +vehiculoId);
  }

  // ========== COMENTARIOS ==========
  @Get(':viajeId/comentarios')
  @ApiOperation({ summary: 'Obtener todos los comentarios de un viaje' })
  @ApiParam({ name: 'viajeId', description: 'ID del viaje', type: Number })
  @ApiResponse({ status: 200, type: [ViajeComentarioResultDto] })
  findComentarios(@Param('viajeId') viajeId: string) {
    return this.viajesService.findComentarios(+viajeId);
  }

  @Get('comentario/:id')
  @ApiOperation({ summary: 'Obtener un comentario por ID' })
  @ApiParam({ name: 'id', description: 'ID del comentario', type: Number })
  @ApiResponse({ status: 200, type: ViajeComentarioResultDto })
  findComentario(@Param('id') id: string) {
    return this.viajesService.findComentario(+id);
  }

  @Post('comentario/create')
  @ApiOperation({ summary: 'Crear un nuevo comentario para un viaje' })
  @ApiResponse({ status: 201, type: ViajeComentarioResultDto })
  createComentario(@Body() createDto: ViajeComentarioCreateDto) {
    return this.viajesService.createComentario(createDto);
  }

  @Patch('comentario/update/:id')
  @ApiOperation({ summary: 'Actualizar un comentario' })
  @ApiParam({ name: 'id', description: 'ID del comentario', type: Number })
  @ApiResponse({ status: 200, type: ViajeComentarioResultDto })
  updateComentario(@Param('id') id: string, @Body() updateDto: ViajeComentarioUpdateDto) {
    return this.viajesService.updateComentario(+id, updateDto);
  }

  @Delete('comentario/delete/:id')
  @ApiOperation({ summary: 'Eliminar un comentario' })
  @ApiParam({ name: 'id', description: 'ID del comentario', type: Number })
  @ApiResponse({ status: 200, type: ViajeComentarioResultDto })
  deleteComentario(@Param('id') id: string) {
    return this.viajesService.deleteComentario(+id);
  }

  // ========== SERVICIOS (Tramos del viaje) ==========
  @Get(':viajeId/servicios')
  @ApiOperation({ summary: 'Obtener todos los servicios/tramos de un viaje' })
  @ApiParam({ name: 'viajeId', description: 'ID del viaje', type: Number })
  @ApiResponse({ status: 200, type: [ViajeServicioResultDto] })
  findServicios(@Param('viajeId') viajeId: string) {
    return this.viajesService.findServicios(+viajeId);
  }

  @Get('servicio/:id')
  @ApiOperation({ summary: 'Obtener un servicio/tramo por ID' })
  @ApiParam({ name: 'id', description: 'ID del servicio', type: Number })
  @ApiResponse({ status: 200, type: ViajeServicioResultDto })
  findServicio(@Param('id') id: string) {
    return this.viajesService.findServicio(+id);
  }

  @Post(':viajeId/servicio/create')
  @ApiOperation({ summary: 'Crear un nuevo servicio/tramo para un viaje' })
  @ApiParam({ name: 'viajeId', description: 'ID del viaje', type: Number })
  @ApiResponse({ status: 201, type: ViajeServicioResultDto })
  createServicio(@Param('viajeId') viajeId: string, @Body() createDto: ViajeServicioCreateDto) {
    return this.viajesService.createServicio(+viajeId, createDto);
  }

  @Patch('servicio/update/:id')
  @ApiOperation({ summary: 'Actualizar un servicio/tramo' })
  @ApiParam({ name: 'id', description: 'ID del servicio', type: Number })
  @ApiResponse({ status: 200, type: ViajeServicioResultDto })
  updateServicio(@Param('id') id: string, @Body() updateDto: ViajeServicioUpdateDto) {
    return this.viajesService.updateServicio(+id, updateDto);
  }

  @Delete('servicio/delete/:id')
  @ApiOperation({ summary: 'Eliminar un servicio/tramo' })
  @ApiParam({ name: 'id', description: 'ID del servicio', type: Number })
  @ApiResponse({ status: 200, type: ViajeServicioResultDto })
  deleteServicio(@Param('id') id: string) {
    return this.viajesService.deleteServicio(+id);
  }

  @Put(':viajeId/servicios/reordenar')
  @ApiOperation({ summary: 'Reordenar los servicios/tramos de un viaje' })
  @ApiParam({ name: 'viajeId', description: 'ID del viaje', type: Number })
  @ApiResponse({ status: 200, type: [ViajeServicioResultDto] })
  reordenarServicios(@Param('viajeId') viajeId: string, @Body() reordenarDto: ViajeServicioReordenarDto) {
    return this.viajesService.reordenarServicios(+viajeId, reordenarDto.servicios);
  }
}

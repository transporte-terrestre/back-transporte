import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VehiculosService } from './vehiculos.service';
import { VehiculoCreateDto } from './dto/vehiculo/vehiculo-create.dto';
import { VehiculoUpdateDto } from './dto/vehiculo/vehiculo-update.dto';
import { VehiculoResultDto } from './dto/vehiculo/vehiculo-result.dto';
import { AuthGuard } from '@nestjs/passport';
import { VehiculoPaginationQueryDto, PaginatedVehiculoResultDto } from './dto/vehiculo/vehiculo-paginated.dto';
import { VehiculoDocumentoCreateDto } from './dto/vehiculo-documento/vehiculo-documento-create.dto';
import { VehiculoDocumentoUpdateDto } from './dto/vehiculo-documento/vehiculo-documento-update.dto';
import { VehiculoDocumentoResultDto } from './dto/vehiculo-documento/vehiculo-documento-result.dto';
import { MarcaCreateDto } from './dto/marca/marca-create.dto';
import { MarcaUpdateDto } from './dto/marca/marca-update.dto';
import { MarcaResultDto } from './dto/marca/marca-result.dto';
import { MarcaPaginationQueryDto, PaginatedMarcaResultDto } from './dto/marca/marca-paginated.dto';
import { ModeloCreateDto } from './dto/modelo/modelo-create.dto';
import { ModeloUpdateDto } from './dto/modelo/modelo-update.dto';
import { ModeloResultDto } from './dto/modelo/modelo-result.dto';
import { ModeloPaginationQueryDto, PaginatedModeloResultDto } from './dto/modelo/modelo-paginated.dto';
import { IpercContinuoDto } from './dto/checklist-document/types/payload-iperc-continuo.dto';
import { LucesEmergenciaAlarmasDto } from './dto/checklist-document/types/payload-luces-emergencia-alarmas.dto';
import { HojaInspeccionDto } from './dto/checklist-document/types/payload-hoja-inspeccion.dto';
import { InspeccionDocumentosDto } from './dto/checklist-document/types/payload-inspeccion-documentos.dto';
import { CinturonesSeguridadDto } from './dto/checklist-document/types/payload-cinturones-seguridad.dto';
import { InspeccionHerramientasDto } from './dto/checklist-document/types/payload-inspeccion-herramientas.dto';
import { InspeccionBotiquinesDto } from './dto/checklist-document/types/payload-inspeccion-botiquines.dto';
import { KitAntiderramesDto } from './dto/checklist-document/types/payload-kit-antiderrames.dto';
import { RevisionVehiculosDto } from './dto/checklist-document/types/payload-revision-vehiculos.dto';
import { ResultIpercContinuoDto } from './dto/checklist-document/types/result-iperc-continuo.dto';
import { ResultLucesEmergenciaAlarmasDto } from './dto/checklist-document/types/result-luces-emergencia-alarmas.dto';
import { ResultHojaInspeccionDto } from './dto/checklist-document/types/result-hoja-inspeccion.dto';
import { ResultInspeccionDocumentosDto } from './dto/checklist-document/types/result-inspeccion-documentos.dto';
import { ResultCinturonesSeguridadDto } from './dto/checklist-document/types/result-cinturones-seguridad.dto';
import { ResultInspeccionHerramientasDto } from './dto/checklist-document/types/result-inspeccion-herramientas.dto';
import { ResultInspeccionBotiquinesDto } from './dto/checklist-document/types/result-inspeccion-botiquines.dto';
import { ResultKitAntiderramesDto } from './dto/checklist-document/types/result-kit-antiderrames.dto';
import { ResultRevisionVehiculosDto } from './dto/checklist-document/types/result-revision-vehiculos.dto';

@ApiTags('vehiculos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('vehiculo')
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  @Get('find-all')
  @ApiOperation({ summary: 'Obtener vehículos con paginación, búsqueda y filtros' })
  @ApiResponse({ status: 200, type: PaginatedVehiculoResultDto })
  findAll(@Query() query: VehiculoPaginationQueryDto) {
    return this.vehiculosService.findAllPaginated(query.page, query.limit, query.search, query.fechaInicio, query.fechaFin, query.estado);
  }

  @Get('find-one/:id')
  @ApiOperation({ summary: 'Get a vehicle by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Vehicle ID' })
  @ApiResponse({ status: 200, type: VehiculoResultDto })
  findOne(@Param('id') id: string) {
    return this.vehiculosService.findOne(+id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiResponse({ status: 200, type: VehiculoResultDto })
  create(@Body() createVehiculoDto: VehiculoCreateDto) {
    return this.vehiculosService.create(createVehiculoDto);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update a vehicle' })
  @ApiParam({ name: 'id', type: 'number', description: 'Vehicle ID' })
  @ApiResponse({ status: 200, type: VehiculoResultDto })
  update(@Param('id') id: string, @Body() updateVehiculoDto: VehiculoUpdateDto) {
    return this.vehiculosService.update(+id, updateVehiculoDto);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a vehicle' })
  @ApiParam({ name: 'id', type: 'number', description: 'Vehicle ID' })
  @ApiResponse({ status: 200, type: VehiculoResultDto })
  remove(@Param('id') id: string) {
    return this.vehiculosService.delete(+id);
  }

  // ========== DOCUMENTOS ==========
  @Get('documento/:id')
  @ApiOperation({ summary: 'Obtener un documento por ID' })
  @ApiParam({ name: 'id', description: 'ID del documento', type: Number })
  @ApiResponse({ status: 200, type: VehiculoDocumentoResultDto })
  findDocumento(@Param('id') id: string) {
    return this.vehiculosService.findDocumento(+id);
  }

  @Post('documento/create')
  @ApiOperation({ summary: 'Crear un nuevo documento de vehículo' })
  @ApiResponse({ status: 201, type: VehiculoDocumentoResultDto })
  createDocumento(@Body() createDto: VehiculoDocumentoCreateDto) {
    return this.vehiculosService.createDocumento(createDto);
  }

  @Patch('documento/update/:id')
  @ApiOperation({ summary: 'Actualizar un documento de vehículo' })
  @ApiParam({ name: 'id', description: 'ID del documento', type: Number })
  @ApiResponse({ status: 200, type: VehiculoDocumentoResultDto })
  updateDocumento(@Param('id') id: string, @Body() updateDto: VehiculoDocumentoUpdateDto) {
    return this.vehiculosService.updateDocumento(+id, updateDto);
  }

  @Delete('documento/delete/:id')
  @ApiOperation({ summary: 'Eliminar un documento de vehículo' })
  @ApiParam({ name: 'id', description: 'ID del documento', type: Number })
  @ApiResponse({ status: 200, type: VehiculoDocumentoResultDto })
  deleteDocumento(@Param('id') id: string) {
    return this.vehiculosService.deleteDocumento(+id);
  }

  // ========== MARCAS ==========
  @Get('marca/find-all')
  @ApiOperation({ summary: 'Obtener marcas con paginación, búsqueda y filtros' })
  @ApiResponse({ status: 200, type: PaginatedMarcaResultDto })
  findAllMarcas(@Query() query: MarcaPaginationQueryDto) {
    return this.vehiculosService.findAllMarcasPaginated(query.page, query.limit, query.search, query.fechaInicio, query.fechaFin);
  }

  @Get('marca/find-one/:id')
  @ApiOperation({ summary: 'Obtener una marca por ID' })
  @ApiParam({ name: 'id', description: 'ID de la marca', type: Number })
  @ApiResponse({ status: 200, type: MarcaResultDto })
  findOneMarca(@Param('id') id: string) {
    return this.vehiculosService.findOneMarca(+id);
  }

  @Post('marca/create')
  @ApiOperation({ summary: 'Crear una nueva marca' })
  @ApiResponse({ status: 201, type: MarcaResultDto })
  createMarca(@Body() createDto: MarcaCreateDto) {
    return this.vehiculosService.createMarca(createDto);
  }

  @Patch('marca/update/:id')
  @ApiOperation({ summary: 'Actualizar una marca' })
  @ApiParam({ name: 'id', description: 'ID de la marca', type: Number })
  @ApiResponse({ status: 200, type: MarcaResultDto })
  updateMarca(@Param('id') id: string, @Body() updateDto: MarcaUpdateDto) {
    return this.vehiculosService.updateMarca(+id, updateDto);
  }

  @Delete('marca/delete/:id')
  @ApiOperation({ summary: 'Eliminar una marca' })
  @ApiParam({ name: 'id', description: 'ID de la marca', type: Number })
  @ApiResponse({ status: 200, type: MarcaResultDto })
  deleteMarca(@Param('id') id: string) {
    return this.vehiculosService.deleteMarca(+id);
  }

  // ========== MODELOS ==========
  @Get('modelo/find-all')
  @ApiOperation({ summary: 'Obtener modelos con paginación, búsqueda y filtros' })
  @ApiResponse({ status: 200, type: PaginatedModeloResultDto })
  findAllModelos(@Query() query: ModeloPaginationQueryDto) {
    return this.vehiculosService.findAllModelosPaginated(query.page, query.limit, query.search, query.marcaId, query.fechaInicio, query.fechaFin);
  }

  @Get('modelo/find-one/:id')
  @ApiOperation({ summary: 'Obtener un modelo por ID' })
  @ApiParam({ name: 'id', description: 'ID del modelo', type: Number })
  @ApiResponse({ status: 200, type: ModeloResultDto })
  findOneModelo(@Param('id') id: string) {
    return this.vehiculosService.findOneModelo(+id);
  }

  @Post('modelo/create')
  @ApiOperation({ summary: 'Crear un nuevo modelo' })
  @ApiResponse({ status: 201, type: ModeloResultDto })
  createModelo(@Body() createDto: ModeloCreateDto) {
    return this.vehiculosService.createModelo(createDto);
  }

  @Patch('modelo/update/:id')
  @ApiOperation({ summary: 'Actualizar un modelo' })
  @ApiParam({ name: 'id', description: 'ID del modelo', type: Number })
  @ApiResponse({ status: 200, type: ModeloResultDto })
  updateModelo(@Param('id') id: string, @Body() updateDto: ModeloUpdateDto) {
    return this.vehiculosService.updateModelo(+id, updateDto);
  }

  @Delete('modelo/delete/:id')
  @ApiOperation({ summary: 'Eliminar un modelo' })
  @ApiParam({ name: 'id', description: 'ID del modelo', type: Number })
  @ApiResponse({ status: 200, type: ModeloResultDto })
  deleteModelo(@Param('id') id: string) {
    return this.vehiculosService.deleteModelo(+id);
  }

  // ========== CHECKLIST CONFIGURATION (FIND - GET) ==========

  // 1. IPERC continuo
  @Get(':id/checklist-document/iperc-continuo/find')
  @ApiOperation({ summary: 'Obtener configuración: IPERC continuo' })
  @ApiResponse({ status: 200, type: ResultIpercContinuoDto })
  @ApiParam({ name: 'id', description: 'ID del Vehículo', type: Number })
  @ApiQuery({ name: 'documentId', required: false, type: Number, description: 'ID específico del documento (opcional)' })
  async findIpercContinuo(@Param('id') id: string, @Query('documentId') documentId?: string) {
    return this.vehiculosService.findIpercContinuo(+id, documentId ? +documentId : undefined);
  }

  // 2. Hoja de Inspección
  @Get(':id/checklist-document/hoja-inspeccion/find')
  @ApiOperation({ summary: 'Obtener configuración: Hoja de Inspección' })
  @ApiResponse({ status: 200, type: ResultHojaInspeccionDto })
  @ApiParam({ name: 'id', description: 'ID del Vehículo', type: Number })
  @ApiQuery({ name: 'documentId', required: false, type: Number, description: 'ID específico del documento (opcional)' })
  async findHojaInspeccion(@Param('id') id: string, @Query('documentId') documentId?: string) {
    return this.vehiculosService.findHojaInspeccion(+id, documentId ? +documentId : undefined);
  }

  // 3. Inspección de Documentos
  @Get(':id/checklist-document/inspeccion-documentos/find')
  @ApiOperation({ summary: 'Obtener configuración: Inspección de Documentos' })
  @ApiResponse({ status: 200, type: ResultInspeccionDocumentosDto })
  @ApiParam({ name: 'id', description: 'ID del Vehículo', type: Number })
  @ApiQuery({ name: 'documentId', required: false, type: Number, description: 'ID específico del documento (opcional)' })
  async findInspeccionDocumentos(@Param('id') id: string, @Query('documentId') documentId?: string) {
    return this.vehiculosService.findInspeccionDocumentos(+id, documentId ? +documentId : undefined);
  }

  // 4. Luces de Emergencia y Alarmas
  @Get(':id/checklist-document/luces-emergencia-alarmas/find')
  @ApiOperation({ summary: 'Obtener configuración: Luces de Emergencia y Alarmas' })
  @ApiResponse({ status: 200, type: ResultLucesEmergenciaAlarmasDto })
  @ApiParam({ name: 'id', description: 'ID del Vehículo', type: Number })
  @ApiQuery({ name: 'documentId', required: false, type: Number, description: 'ID específico del documento (opcional)' })
  async findLuces(@Param('id') id: string, @Query('documentId') documentId?: string) {
    return this.vehiculosService.findLucesChecklist(+id, documentId ? +documentId : undefined);
  }

  // 5. Cinturones de Seguridad
  @Get(':id/checklist-document/cinturones-seguridad/find')
  @ApiOperation({ summary: 'Obtener configuración: Cinturones de Seguridad' })
  @ApiResponse({ status: 200, type: ResultCinturonesSeguridadDto })
  @ApiParam({ name: 'id', description: 'ID del Vehículo', type: Number })
  @ApiQuery({ name: 'documentId', required: false, type: Number, description: 'ID específico del documento (opcional)' })
  async findCinturones(@Param('id') id: string, @Query('documentId') documentId?: string) {
    return this.vehiculosService.findCinturones(+id, documentId ? +documentId : undefined);
  }

  // 6. Inspección de Herramientas
  @Get(':id/checklist-document/inspeccion-herramientas/find')
  @ApiOperation({ summary: 'Obtener configuración: Inspección de Herramientas' })
  @ApiResponse({ status: 200, type: ResultInspeccionHerramientasDto })
  @ApiParam({ name: 'id', description: 'ID del Vehículo', type: Number })
  @ApiQuery({ name: 'documentId', required: false, type: Number, description: 'ID específico del documento (opcional)' })
  async findHerramientas(@Param('id') id: string, @Query('documentId') documentId?: string) {
    return this.vehiculosService.findHerramientas(+id, documentId ? +documentId : undefined);
  }

  // 7. Inspección de Botiquines
  @Get(':id/checklist-document/inspeccion-botiquines/find')
  @ApiOperation({ summary: 'Obtener configuración: Inspección de Botiquines' })
  @ApiResponse({ status: 200, type: ResultInspeccionBotiquinesDto })
  @ApiParam({ name: 'id', description: 'ID del Vehículo', type: Number })
  @ApiQuery({ name: 'documentId', required: false, type: Number, description: 'ID específico del documento (opcional)' })
  async findBotiquines(@Param('id') id: string, @Query('documentId') documentId?: string) {
    return this.vehiculosService.findBotiquines(+id, documentId ? +documentId : undefined);
  }

  // 8. Kit Antiderrames
  @Get(':id/checklist-document/kit-antiderrames/find')
  @ApiOperation({ summary: 'Obtener configuración: Kit Antiderrames' })
  @ApiResponse({ status: 200, type: ResultKitAntiderramesDto })
  @ApiParam({ name: 'id', description: 'ID del Vehículo', type: Number })
  @ApiQuery({ name: 'documentId', required: false, type: Number, description: 'ID específico del documento (opcional)' })
  async findKitAntiderrames(@Param('id') id: string, @Query('documentId') documentId?: string) {
    return this.vehiculosService.findKitAntiderrames(+id, documentId ? +documentId : undefined);
  }

  // 9. Revisión de Vehículos
  @Get(':id/checklist-document/revision-vehiculos/find')
  @ApiOperation({ summary: 'Obtener configuración: Revisión de Vehículos' })
  @ApiResponse({ status: 200, type: ResultRevisionVehiculosDto })
  @ApiParam({ name: 'id', description: 'ID del Vehículo', type: Number })
  @ApiQuery({ name: 'documentId', required: false, type: Number, description: 'ID específico del documento (opcional)' })
  async findRevisionVehiculos(@Param('id') id: string, @Query('documentId') documentId?: string) {
    return this.vehiculosService.findRevisionVehiculos(+id, documentId ? +documentId : undefined);
  }

  // ========== CHECKLIST CONFIGURATION (UPSERT - POST) ==========

  // 1. IPERC continuo
  @Post(':id/viaje/:viajeId/checklist-document/iperc-continuo/upsert')
  @ApiOperation({ summary: 'Configurar Checklist: IPERC continuo' })
  @ApiParam({ name: 'id', description: 'ID del Vehículo', type: Number })
  @ApiParam({ name: 'viajeId', description: 'ID del Viaje', type: Number })
  async upsertIpercContinuo(@Param('id') id: string, @Param('viajeId') viajeId: string, @Body() data: IpercContinuoDto) {
    return this.vehiculosService.upsertIpercContinuo(+id, +viajeId, data);
  }

  // 2. Hoja de Inspección
  @Post(':id/viaje/:viajeId/checklist-document/hoja-inspeccion/upsert')
  @ApiOperation({ summary: 'Configurar Checklist: Hoja de Inspección' })
  @ApiParam({ name: 'id', description: 'ID del Vehículo', type: Number })
  @ApiParam({ name: 'viajeId', description: 'ID del Viaje', type: Number })
  @ApiResponse({ status: 201, type: ResultHojaInspeccionDto })
  async upsertHojaInspeccion(@Param('id') id: string, @Param('viajeId') viajeId: string, @Body() data: HojaInspeccionDto) {
    return this.vehiculosService.upsertHojaInspeccion(+id, +viajeId, data);
  }

  // 3. Inspección de Documentos
  @Post(':id/viaje/:viajeId/checklist-document/inspeccion-documentos/upsert')
  @ApiOperation({ summary: 'Configurar Checklist: Inspección de Documentos' })
  @ApiParam({ name: 'id', description: 'ID del Vehículo', type: Number })
  @ApiParam({ name: 'viajeId', description: 'ID del Viaje', type: Number })
  @ApiResponse({ status: 201, type: ResultInspeccionDocumentosDto })
  async upsertInspeccionDocumentos(@Param('id') id: string, @Param('viajeId') viajeId: string, @Body() data: InspeccionDocumentosDto) {
    return this.vehiculosService.upsertInspeccionDocumentos(+id, +viajeId, data);
  }

  // 4. Luces de Emergencia y Alarmas
  @Post(':id/viaje/:viajeId/checklist-document/luces-emergencia-alarmas/upsert')
  @ApiOperation({ summary: 'Configurar Checklist: Luces de Emergencia y Alarmas' })
  @ApiParam({ name: 'id', description: 'ID del Vehículo', type: Number })
  @ApiParam({ name: 'viajeId', description: 'ID del Viaje', type: Number })
  @ApiResponse({ status: 201, type: ResultLucesEmergenciaAlarmasDto })
  async upsertLuces(@Param('id') id: string, @Param('viajeId') viajeId: string, @Body() data: LucesEmergenciaAlarmasDto) {
    return this.vehiculosService.upsertLucesChecklist(+id, +viajeId, data);
  }

  // 5. Cinturones de Seguridad
  @Post(':id/viaje/:viajeId/checklist-document/cinturones-seguridad/upsert')
  @ApiOperation({ summary: 'Configurar Checklist: Cinturones de Seguridad' })
  @ApiParam({ name: 'id', description: 'ID del Vehículo', type: Number })
  @ApiParam({ name: 'viajeId', description: 'ID del Viaje', type: Number })
  @ApiResponse({ status: 201, type: ResultCinturonesSeguridadDto })
  async upsertCinturones(@Param('id') id: string, @Param('viajeId') viajeId: string, @Body() data: CinturonesSeguridadDto) {
    return this.vehiculosService.upsertCinturones(+id, +viajeId, data);
  }

  // 6. Inspección de Herramientas
  @Post(':id/viaje/:viajeId/checklist-document/inspeccion-herramientas/upsert')
  @ApiOperation({ summary: 'Configurar Checklist: Inspección de Herramientas' })
  @ApiParam({ name: 'id', description: 'ID del Vehículo', type: Number })
  @ApiParam({ name: 'viajeId', description: 'ID del Viaje', type: Number })
  @ApiResponse({ status: 201, type: ResultInspeccionHerramientasDto })
  async upsertHerramientas(@Param('id') id: string, @Param('viajeId') viajeId: string, @Body() data: InspeccionHerramientasDto) {
    return this.vehiculosService.upsertHerramientas(+id, +viajeId, data);
  }

  // 7. Inspección de Botiquines
  @Post(':id/viaje/:viajeId/checklist-document/inspeccion-botiquines/upsert')
  @ApiOperation({ summary: 'Configurar Checklist: Inspección de Botiquines' })
  @ApiParam({ name: 'id', description: 'ID del Vehículo', type: Number })
  @ApiParam({ name: 'viajeId', description: 'ID del Viaje', type: Number })
  @ApiResponse({ status: 201, type: ResultInspeccionBotiquinesDto })
  async upsertBotiquines(@Param('id') id: string, @Param('viajeId') viajeId: string, @Body() data: InspeccionBotiquinesDto) {
    return this.vehiculosService.upsertBotiquines(+id, +viajeId, data);
  }

  // 8. Kit Antiderrames
  @Post(':id/viaje/:viajeId/checklist-document/kit-antiderrames/upsert')
  @ApiOperation({ summary: 'Configurar Checklist: Kit Antiderrames' })
  @ApiParam({ name: 'id', description: 'ID del Vehículo', type: Number })
  @ApiParam({ name: 'viajeId', description: 'ID del Viaje', type: Number })
  @ApiResponse({ status: 201, type: ResultKitAntiderramesDto })
  async upsertKitAntiderrames(@Param('id') id: string, @Param('viajeId') viajeId: string, @Body() data: KitAntiderramesDto) {
    return this.vehiculosService.upsertKitAntiderrames(+id, +viajeId, data);
  }

  // 9. Revisión de Vehículos
  @Post(':id/viaje/:viajeId/checklist-document/revision-vehiculos/upsert')
  @ApiOperation({ summary: 'Configurar Checklist: Revisión de Vehículos' })
  @ApiParam({ name: 'id', description: 'ID del Vehículo', type: Number })
  @ApiParam({ name: 'viajeId', description: 'ID del Viaje', type: Number })
  async upsertRevisionVehiculos(@Param('id') id: string, @Param('viajeId') viajeId: string, @Body() data: RevisionVehiculosDto) {
    return this.vehiculosService.upsertRevisionVehiculos(+id, +viajeId, data);
  }
}

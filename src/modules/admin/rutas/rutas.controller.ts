import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RutasService } from './rutas.service';
// import { RutaCreateDto } from './dto/ruta/ruta-create.dto'; // Deprecated
// import { RutaUpdateDto } from './dto/ruta/ruta-update.dto'; // Deprecated
import { RutaResultDto } from './dto/ruta/ruta-result.dto';
import { AuthGuard } from '@nestjs/passport';
import { RutaPaginationQueryDto, PaginatedRutaResultDto } from './dto/ruta/ruta-paginated.dto';
import { RutaParadaResultDto } from './dto/ruta-parada/ruta-parada-result.dto';
import { RutaCircuitoResultDto } from './dto/ruta-circuito/ruta-circuito-result.dto';
import { RutaCircuitoPaginationQueryDto, PaginatedRutaCircuitoResultDto } from './dto/ruta-circuito/ruta-circuito-paginated.dto';
import { RutaCircuitoCreateDto } from './dto/ruta-circuito/ruta-circuito-create.dto';
import { RutaCircuitoUpdateDto } from './dto/ruta-circuito/ruta-circuito-update.dto';

@ApiTags('rutas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('ruta')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  // ==========================================
  // ENDPOINTS DE RUTAS (LEGACY / CONSULTA)
  // ==========================================

  @Get('find-all')
  @ApiOperation({
    summary: 'Obtener rutas con paginación, búsqueda y filtros',
    description: 'Busca por origen o destino. Filtra por rango de fechas.',
  })
  @ApiResponse({ status: 200, type: PaginatedRutaResultDto })
  async findAll(@Query() query: RutaPaginationQueryDto): Promise<PaginatedRutaResultDto> {
    return await this.rutasService.findAllPaginated(query.page, query.limit, query.search, query.fechaInicio, query.fechaFin);
  }

  @Get('find-one/:id')
  @ApiOperation({ summary: 'Obtener una ruta por ID con sus paradas' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID de la ruta' })
  @ApiResponse({ status: 200, type: RutaResultDto })
  async findOne(@Param('id') id: string) {
    return await this.rutasService.findOne(+id);
  }

  // ==========================================
  // ENDPOINTS DE PARADAS
  // ==========================================

  @Get(':rutaId/paradas')
  @ApiOperation({ summary: 'Obtener todas las paradas de una ruta' })
  @ApiParam({ name: 'rutaId', type: 'number', description: 'ID de la ruta' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nombre de parada' })
  @ApiResponse({ status: 200, type: [RutaParadaResultDto] })
  async findParadas(@Param('rutaId') rutaId: string, @Query('search') search?: string): Promise<RutaParadaResultDto[]> {
    return await this.rutasService.findParadas(+rutaId, search);
  }

  // ==========================================
  // ENDPOINTS DE CIRCUITOS (NUEVO CRUD PRINCIPAL)
  // ==========================================

  @Get('circuito/find-all')
  @ApiOperation({ summary: 'Obtener circuitos con paginación, búsqueda y filtros' })
  @ApiResponse({ status: 200, type: PaginatedRutaCircuitoResultDto })
  async findAllCircuitos(@Query() query: RutaCircuitoPaginationQueryDto): Promise<PaginatedRutaCircuitoResultDto> {
    return await this.rutasService.findAllCircuitosPaginated(query.page, query.limit, query.search, query.fechaInicio, query.fechaFin);
  }

  @Get('circuito/find-one/:id')
  @ApiOperation({ summary: 'Obtener un circuito por ID con sus rutas y paradas' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del circuito' })
  @ApiResponse({ status: 200, type: RutaCircuitoResultDto })
  async findOneCircuito(@Param('id') id: string) {
    return await this.rutasService.findOneCircuito(+id);
  }

  @Post('circuito/create')
  @ApiOperation({ summary: 'Crear un nuevo circuito con rutas de ida y vuelta' })
  @ApiResponse({ status: 200, type: RutaCircuitoResultDto })
  async createCircuito(@Body() createCircuitoDto: RutaCircuitoCreateDto) {
    return await this.rutasService.createCircuito(createCircuitoDto);
  }

  @Patch('circuito/update/:id')
  @ApiOperation({ summary: 'Actualizar un circuito y sus rutas (reemplazo inteligente)' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del circuito' })
  @ApiResponse({ status: 200, type: RutaCircuitoResultDto })
  async updateCircuito(@Param('id') id: string, @Body() updateCircuitoDto: RutaCircuitoUpdateDto) {
    return await this.rutasService.updateCircuito(+id, updateCircuitoDto);
  }

  @Delete('circuito/delete/:id')
  @ApiOperation({ summary: 'Eliminar un circuito y sus rutas asociadas' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del circuito' })
  @ApiResponse({ status: 200, description: 'Mensaje de confirmación' })
  async removeCircuito(@Param('id') id: string) {
    return await this.rutasService.deleteCircuito(+id);
  }
}

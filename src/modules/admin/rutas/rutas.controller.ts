import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RutasService } from './rutas.service';
import { RutaCreateDto } from './dto/ruta/ruta-create.dto';
import { RutaUpdateDto } from './dto/ruta/ruta-update.dto';
import { RutaResultDto } from './dto/ruta/ruta-result.dto';
import { AuthGuard } from '@nestjs/passport';
import { RutaPaginationQueryDto, PaginatedRutaResultDto } from './dto/ruta/ruta-paginated.dto';
import { RutaParadaResultDto } from './dto/ruta-parada/ruta-parada-result.dto';

@ApiTags('rutas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('ruta')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

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

  @Post('create')
  @ApiOperation({ summary: 'Crear una nueva ruta' })
  @ApiResponse({ status: 200, type: RutaResultDto })
  async create(@Body() createRutaDto: RutaCreateDto) {
    return await this.rutasService.create(createRutaDto);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Actualizar una ruta' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID de la ruta' })
  @ApiResponse({ status: 200, type: RutaResultDto })
  async update(@Param('id') id: string, @Body() updateRutaDto: RutaUpdateDto) {
    return await this.rutasService.update(+id, updateRutaDto);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Eliminar una ruta' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID de la ruta' })
  @ApiResponse({ status: 200, type: RutaResultDto })
  async remove(@Param('id') id: string) {
    return await this.rutasService.delete(+id);
  }

  // ========== ENDPOINTS DE PARADAS ==========

  @Get(':rutaId/paradas')
  @ApiOperation({ summary: 'Obtener todas las paradas de una ruta' })
  @ApiParam({ name: 'rutaId', type: 'number', description: 'ID de la ruta' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nombre de parada' })
  @ApiResponse({ status: 200, type: [RutaParadaResultDto] })
  async findParadas(@Param('rutaId') rutaId: string, @Query('search') search?: string): Promise<RutaParadaResultDto[]> {
    return await this.rutasService.findParadas(+rutaId, search);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PropietariosService } from './propietarios.service';
import { PropietarioCreateDto } from './dto/propietario-create.dto';
import { PropietarioUpdateDto } from './dto/propietario-update.dto';
import { PropietarioResultDto } from './dto/propietario-result.dto';
import { AuthGuard } from '@nestjs/passport';
import { PropietarioPaginationQueryDto, PaginatedPropietarioResultDto } from './dto/propietario-paginated.dto';
import { PropietarioDocumentoCreateDto } from './dto/propietario-documento-create.dto';
import { PropietarioDocumentoUpdateDto } from './dto/propietario-documento-update.dto';
import { PropietarioDocumentoResultDto } from './dto/propietario-documento-result.dto';

@ApiTags('propietarios')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('propietario')
export class PropietariosController {
  constructor(private readonly propietariosService: PropietariosService) {}

  @Get('find-all')
  @ApiOperation({
    summary: 'Obtener propietarios con paginación, búsqueda y filtros',
  })
  @ApiResponse({ status: 200, type: PaginatedPropietarioResultDto })
  findAll(@Query() query: PropietarioPaginationQueryDto) {
    return this.propietariosService.findAllPaginated(query.page, query.limit, query.search, query.fechaInicio, query.fechaFin, query.tipoDocumento);
  }

  @Get('find-one/:id')
  @ApiOperation({ summary: 'Obtener un propietario por ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del propietario' })
  @ApiResponse({ status: 200, type: PropietarioResultDto })
  findOne(@Param('id') id: string) {
    return this.propietariosService.findOne(+id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Crear un nuevo propietario' })
  @ApiResponse({ status: 200, type: PropietarioResultDto })
  create(@Body() createPropietarioDto: PropietarioCreateDto) {
    return this.propietariosService.create(createPropietarioDto);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Actualizar un propietario' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del propietario' })
  @ApiResponse({ status: 200, type: PropietarioResultDto })
  update(@Param('id') id: string, @Body() updatePropietarioDto: PropietarioUpdateDto) {
    return this.propietariosService.update(+id, updatePropietarioDto);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Eliminar un propietario' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del propietario' })
  @ApiResponse({ status: 200, type: PropietarioResultDto })
  remove(@Param('id') id: string) {
    return this.propietariosService.remove(+id);
  }

  // ========== DOCUMENTOS ==========
  @Get('documento/:id')
  @ApiOperation({ summary: 'Obtener un documento por ID' })
  @ApiParam({ name: 'id', description: 'ID del documento', type: Number })
  @ApiResponse({ status: 200, type: PropietarioDocumentoResultDto })
  findDocumento(@Param('id') id: string) {
    return this.propietariosService.findDocumento(+id);
  }

  @Post('documento/create')
  @ApiOperation({ summary: 'Crear un nuevo documento de propietario' })
  @ApiResponse({ status: 201, type: PropietarioDocumentoResultDto })
  createDocumento(@Body() createDto: PropietarioDocumentoCreateDto) {
    return this.propietariosService.createDocumento(createDto);
  }

  @Patch('documento/update/:id')
  @ApiOperation({ summary: 'Actualizar un documento de propietario' })
  @ApiParam({ name: 'id', description: 'ID del documento', type: Number })
  @ApiResponse({ status: 200, type: PropietarioDocumentoResultDto })
  updateDocumento(@Param('id') id: string, @Body() updateDto: PropietarioDocumentoUpdateDto) {
    return this.propietariosService.updateDocumento(+id, updateDto);
  }

  @Delete('documento/delete/:id')
  @ApiOperation({ summary: 'Eliminar un documento de propietario' })
  @ApiParam({ name: 'id', description: 'ID del documento', type: Number })
  @ApiResponse({ status: 200, type: PropietarioDocumentoResultDto })
  deleteDocumento(@Param('id') id: string) {
    return this.propietariosService.deleteDocumento(+id);
  }
}

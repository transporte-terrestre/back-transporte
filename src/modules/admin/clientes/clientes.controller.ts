import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { ClienteCreateDto } from './dto/cliente-create.dto';
import { ClienteUpdateDto } from './dto/cliente-update.dto';
import { ClienteResultDto } from './dto/cliente-result.dto';
import { AuthGuard } from '@nestjs/passport';
import { ClientePaginationQueryDto, PaginatedClienteResultDto } from './dto/cliente-paginated.dto';
import { ClienteDocumentoCreateDto } from './dto/cliente-documento-create.dto';
import { ClienteDocumentoUpdateDto } from './dto/cliente-documento-update.dto';
import { ClienteDocumentoResultDto } from './dto/cliente-documento-result.dto';

@ApiTags('clientes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('cliente')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get('find-all')
  @ApiOperation({
    summary: 'Obtener clientes con paginación, búsqueda y filtros',
  })
  @ApiResponse({ status: 200, type: PaginatedClienteResultDto })
  findAll(@Query() query: ClientePaginationQueryDto) {
    return this.clientesService.findAllPaginated(query.page, query.limit, query.search, query.fechaInicio, query.fechaFin, query.tipoDocumento);
  }

  @Get('find-one/:id')
  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del cliente' })
  @ApiResponse({ status: 200, type: ClienteResultDto })
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(+id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({ status: 200, type: ClienteResultDto })
  create(@Body() createClienteDto: ClienteCreateDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Actualizar un cliente' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del cliente' })
  @ApiResponse({ status: 200, type: ClienteResultDto })
  update(@Param('id') id: string, @Body() updateClienteDto: ClienteUpdateDto) {
    return this.clientesService.update(+id, updateClienteDto);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Eliminar un cliente' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del cliente' })
  @ApiResponse({ status: 200, type: ClienteResultDto })
  remove(@Param('id') id: string) {
    return this.clientesService.remove(+id);
  }

  // ========== DOCUMENTOS ==========
  @Get('documento/:id')
  @ApiOperation({ summary: 'Obtener un documento por ID' })
  @ApiParam({ name: 'id', description: 'ID del documento', type: Number })
  @ApiResponse({ status: 200, type: ClienteDocumentoResultDto })
  findDocumento(@Param('id') id: string) {
    return this.clientesService.findDocumento(+id);
  }

  @Post('documento/create')
  @ApiOperation({ summary: 'Crear un nuevo documento de cliente' })
  @ApiResponse({ status: 201, type: ClienteDocumentoResultDto })
  createDocumento(@Body() createDto: ClienteDocumentoCreateDto) {
    return this.clientesService.createDocumento(createDto);
  }

  @Patch('documento/update/:id')
  @ApiOperation({ summary: 'Actualizar un documento de cliente' })
  @ApiParam({ name: 'id', description: 'ID del documento', type: Number })
  @ApiResponse({ status: 200, type: ClienteDocumentoResultDto })
  updateDocumento(@Param('id') id: string, @Body() updateDto: ClienteDocumentoUpdateDto) {
    return this.clientesService.updateDocumento(+id, updateDto);
  }

  @Delete('documento/delete/:id')
  @ApiOperation({ summary: 'Eliminar un documento de cliente' })
  @ApiParam({ name: 'id', description: 'ID del documento', type: Number })
  @ApiResponse({ status: 200, type: ClienteDocumentoResultDto })
  deleteDocumento(@Param('id') id: string) {
    return this.clientesService.deleteDocumento(+id);
  }
}

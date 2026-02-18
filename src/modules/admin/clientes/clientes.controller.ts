import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { ClienteCreateDto } from './dto/cliente/cliente-create.dto';
import { ClienteUpdateDto } from './dto/cliente/cliente-update.dto';
import { ClienteResultDto } from './dto/cliente/cliente-result.dto';
import { AuthGuard } from '@nestjs/passport';
import { ClientePaginationQueryDto, PaginatedClienteResultDto } from './dto/cliente/cliente-paginated.dto';
import { ClienteDocumentoCreateDto } from './dto/cliente-documento/cliente-documento-create.dto';
import { ClienteDocumentoUpdateDto } from './dto/cliente-documento/cliente-documento-update.dto';
import { ClienteDocumentoResultDto } from './dto/cliente-documento/cliente-documento-result.dto';
import { PasajeroCreateDto } from './dto/pasajero/pasajero-create.dto';
import { PasajeroUpdateDto } from './dto/pasajero/pasajero-update.dto';
import { PaginatedPasajeroResultDto } from './dto/pasajero/pasajero-paginated.dto';
import { PasajeroPaginationQueryDto } from './dto/pasajero/pasajero-pagination.dto';
import { PasajeroResultDto } from './dto/pasajero/pasajero-result.dto';

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

  // ========== PASAJEROS ==========

  @Get('pasajero/find-all')
  @ApiOperation({
    summary: 'Obtener pasajeros con paginación, búsqueda y filtro por cliente',
  })
  @ApiResponse({ status: 200, type: PaginatedPasajeroResultDto })
  findAllPasajeros(@Query() query: PasajeroPaginationQueryDto) {
    return this.clientesService.findAllPasajerosPaginated(query.page, query.limit, query.search, query.clienteId);
  }

  @Get('pasajero/find-one/:id')
  @ApiOperation({ summary: 'Obtener un pasajero por ID' })
  @ApiParam({ name: 'id', description: 'ID del pasajero', type: Number })
  @ApiResponse({ status: 200, type: PasajeroResultDto })
  findPasajero(@Param('id') id: string) {
    return this.clientesService.findPasajero(+id);
  }

  @Post('pasajero/create')
  @ApiOperation({ summary: 'Crear un nuevo pasajero' })
  @ApiResponse({ status: 201, type: PasajeroResultDto })
  createPasajero(@Body() createDto: PasajeroCreateDto) {
    return this.clientesService.createPasajero(createDto);
  }

  @Patch('pasajero/update/:id')
  @ApiOperation({ summary: 'Actualizar un pasajero' })
  @ApiParam({ name: 'id', description: 'ID del pasajero', type: Number })
  @ApiResponse({ status: 200, type: PasajeroResultDto })
  updatePasajero(@Param('id') id: string, @Body() updateDto: PasajeroUpdateDto) {
    return this.clientesService.updatePasajero(+id, updateDto);
  }

  @Delete('pasajero/delete/:id')
  @ApiOperation({ summary: 'Eliminar un pasajero' })
  @ApiParam({ name: 'id', description: 'ID del pasajero', type: Number })
  @ApiResponse({ status: 200, type: PasajeroResultDto })
  deletePasajero(@Param('id') id: string) {
    return this.clientesService.deletePasajero(+id);
  }
}

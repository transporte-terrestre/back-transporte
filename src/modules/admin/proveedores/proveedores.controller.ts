import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProveedoresService } from './proveedores.service';
import { ProveedorCreateDto } from './dto/proveedor/proveedor-create.dto';
import { ProveedorUpdateDto } from './dto/proveedor/proveedor-update.dto';
import { ProveedorResultDto } from './dto/proveedor/proveedor-result.dto';
import { AuthGuard } from '@nestjs/passport';
import { ProveedorPaginationQueryDto, PaginatedProveedorResultDto } from './dto/proveedor/proveedor-paginated.dto';
import { ProveedorDocumentoCreateDto } from './dto/proveedor-documento/proveedor-documento-create.dto';
import { ProveedorDocumentoUpdateDto } from './dto/proveedor-documento/proveedor-documento-update.dto';
import { ProveedorDocumentoResultDto } from './dto/proveedor-documento/proveedor-documento-result.dto';

@ApiTags('proveedores')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('proveedor')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Get('find-all')
  @ApiOperation({
    summary: 'Obtener proveedores con paginación, búsqueda y filtros',
  })
  @ApiResponse({ status: 200, type: PaginatedProveedorResultDto })
  findAll(@Query() query: ProveedorPaginationQueryDto) {
    return this.proveedoresService.findAllPaginated(query.page, query.limit, query.search, query.fechaInicio, query.fechaFin, query.tipoDocumento);
  }

  @Get('find-one/:id')
  @ApiOperation({ summary: 'Obtener un proveedor por ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del proveedor' })
  @ApiResponse({ status: 200, type: ProveedorResultDto })
  findOne(@Param('id') id: string) {
    return this.proveedoresService.findOne(+id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Crear un nuevo proveedor' })
  @ApiResponse({ status: 200, type: ProveedorResultDto })
  create(@Body() createProveedorDto: ProveedorCreateDto) {
    return this.proveedoresService.create(createProveedorDto);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Actualizar un proveedor' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del proveedor' })
  @ApiResponse({ status: 200, type: ProveedorResultDto })
  update(@Param('id') id: string, @Body() updateProveedorDto: ProveedorUpdateDto) {
    return this.proveedoresService.update(+id, updateProveedorDto);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Eliminar un proveedor' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del proveedor' })
  @ApiResponse({ status: 200, type: ProveedorResultDto })
  remove(@Param('id') id: string) {
    return this.proveedoresService.remove(+id);
  }

  // ========== DOCUMENTOS ==========
  @Get('documento/:id')
  @ApiOperation({ summary: 'Obtener un documento por ID' })
  @ApiParam({ name: 'id', description: 'ID del documento', type: Number })
  @ApiResponse({ status: 200, type: ProveedorDocumentoResultDto })
  findDocumento(@Param('id') id: string) {
    return this.proveedoresService.findDocumento(+id);
  }

  @Post('documento/create')
  @ApiOperation({ summary: 'Crear un nuevo documento de proveedor' })
  @ApiResponse({ status: 201, type: ProveedorDocumentoResultDto })
  createDocumento(@Body() createDto: ProveedorDocumentoCreateDto) {
    return this.proveedoresService.createDocumento(createDto);
  }

  @Patch('documento/update/:id')
  @ApiOperation({ summary: 'Actualizar un documento de proveedor' })
  @ApiParam({ name: 'id', description: 'ID del documento', type: Number })
  @ApiResponse({ status: 200, type: ProveedorDocumentoResultDto })
  updateDocumento(@Param('id') id: string, @Body() updateDto: ProveedorDocumentoUpdateDto) {
    return this.proveedoresService.updateDocumento(+id, updateDto);
  }

  @Delete('documento/delete/:id')
  @ApiOperation({ summary: 'Eliminar un documento de proveedor' })
  @ApiParam({ name: 'id', description: 'ID del documento', type: Number })
  @ApiResponse({ status: 200, type: ProveedorDocumentoResultDto })
  deleteDocumento(@Param('id') id: string) {
    return this.proveedoresService.deleteDocumento(+id);
  }
}

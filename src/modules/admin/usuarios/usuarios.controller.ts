import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { UsuarioCreateDto } from './dto/usuario/usuario-create.dto';
import { UsuarioUpdateDto } from './dto/usuario/usuario-update.dto';
import { UsuarioResultDto } from './dto/usuario/usuario-result.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsuarioPaginationQueryDto, PaginatedUsuarioResultDto } from './dto/usuario/usuario-paginated.dto';
import { UsuarioDocumentoCreateDto } from './dto/usuario-documento/usuario-documento-create.dto';
import { UsuarioDocumentoUpdateDto } from './dto/usuario-documento/usuario-documento-update.dto';
import { UsuarioDocumentoResultDto } from './dto/usuario-documento/usuario-documento-result.dto';

@ApiTags('usuarios')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('usuario')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('find-all')
  @ApiOperation({
    summary: 'Obtener usuarios con./dto/usuario/usuario-result.dtofiltros',
    description: 'Busca por nombre, apellido o email. Filtra por rango de fechas.',
  })
  @ApiResponse({ status: 200, type: PaginatedUsuarioResultDto })
  findAll(@Query() query: UsuarioPaginationQueryDto) {
    return this.usuariosService.findAllPaginated(query.page, query.limit, query.search, query.fechaInicio, query.fechaFin, query.rol);
  }

  @Get('find-one/:id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'User ID' })
  @ApiResponse({ status: 200, type: UsuarioResultDto })
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 200, type: UsuarioResultDto })
  create(@Body() createUsuarioDto: UsuarioCreateDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', type: 'number', description: 'User ID' })
  @ApiResponse({ status: 200, type: UsuarioResultDto })
  update(@Param('id') id: string, @Body() updateUsuarioDto: UsuarioUpdateDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', type: 'number', description: 'User ID' })
  @ApiResponse({ status: 200, type: UsuarioResultDto })
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }

  // ========== DOCUMENTOS ==========
  @Get('documento/:id')
  @ApiOperation({ summary: 'Obtener un documento por ID' })
  @ApiParam({ name: 'id', description: 'ID del documento', type: Number })
  @ApiResponse({ status: 200, type: UsuarioDocumentoResultDto })
  findDocumento(@Param('id') id: string) {
    return this.usuariosService.findDocumento(+id);
  }

  @Post('documento/create')
  @ApiOperation({ summary: 'Crear un nuevo documento de usuario' })
  @ApiResponse({ status: 201, type: UsuarioDocumentoResultDto })
  createDocumento(@Body() createDto: UsuarioDocumentoCreateDto) {
    return this.usuariosService.createDocumento(createDto);
  }

  @Patch('documento/update/:id')
  @ApiOperation({ summary: 'Actualizar un documento de usuario' })
  @ApiParam({ name: 'id', description: 'ID del documento', type: Number })
  @ApiResponse({ status: 200, type: UsuarioDocumentoResultDto })
  updateDocumento(@Param('id') id: string, @Body() updateDto: UsuarioDocumentoUpdateDto) {
    return this.usuariosService.updateDocumento(+id, updateDto);
  }

  @Delete('documento/delete/:id')
  @ApiOperation({ summary: 'Eliminar un documento de usuario' })
  @ApiParam({ name: 'id', description: 'ID del documento', type: Number })
  @ApiResponse({ status: 200, type: UsuarioDocumentoResultDto })
  deleteDocumento(@Param('id') id: string) {
    return this.usuariosService.deleteDocumento(+id);
  }
}

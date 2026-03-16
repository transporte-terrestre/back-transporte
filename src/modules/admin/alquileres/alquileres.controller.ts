import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AlquileresService } from './alquileres.service';
import { AlquilerCreateDto } from './dto/alquiler/alquiler-create.dto';
import { AlquilerUpdateDto } from './dto/alquiler/alquiler-update.dto';
import { AlquilerQueryDto, AlquilerListDto } from './dto/alquiler/alquiler-list.dto';
import { AlquilerResultDto } from './dto/alquiler/alquiler-result.dto';
import { AlquilerTerminarDto } from './dto/alquiler/alquiler-terminar.dto';
import { AlquilerDocumentoCreateDto } from './dto/alquiler-documento/alquiler-documento-create.dto';
import { AlquilerDocumentoUpdateDto } from './dto/alquiler-documento/alquiler-documento-update.dto';
import { AlquilerDocumentoResultDto } from './dto/alquiler-documento/alquiler-documento-result.dto';

@ApiTags('alquileres')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('admin/alquileres')
export class AlquileresController {
  constructor(private readonly alquileresService: AlquileresService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los alquileres (paginado)' })
  @ApiResponse({ status: 200, type: AlquilerListDto })
  findAll(@Query() query: AlquilerQueryDto) {
    return this.alquileresService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un alquiler por ID' })
  @ApiResponse({ status: 200, type: AlquilerResultDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.alquileresService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo alquiler' })
  @ApiResponse({ status: 201, type: AlquilerResultDto })
  create(@Body() data: AlquilerCreateDto) {
    return this.alquileresService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un alquiler' })
  @ApiResponse({ status: 200, type: AlquilerResultDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: AlquilerUpdateDto) {
    return this.alquileresService.update(id, data);
  }

  @Put(':id/terminar')
  @ApiOperation({ summary: 'Finalizar un alquiler (fecha fin, kilometraje final y monto final)' })
  @ApiResponse({ status: 200, type: AlquilerResultDto })
  terminar(@Param('id', ParseIntPipe) id: number, @Body() data: AlquilerTerminarDto) {
    return this.alquileresService.terminar(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un alquiler' })
  @ApiResponse({ status: 200 })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.alquileresService.delete(id);
  }

  // ========== DOCUMENTOS ==========
  @Get('documento/:id')
  @ApiOperation({ summary: 'Obtener un documento de alquiler por ID' })
  @ApiResponse({ status: 200, type: AlquilerDocumentoResultDto })
  findDocumento(@Param('id', ParseIntPipe) id: number) {
    return this.alquileresService.findDocumento(id);
  }

  @Post('documento/create')
  @ApiOperation({ summary: 'Crear un documento de alquiler' })
  @ApiResponse({ status: 201, type: AlquilerDocumentoResultDto })
  createDocumento(@Body() data: AlquilerDocumentoCreateDto) {
    return this.alquileresService.createDocumento(data);
  }

  @Put('documento/update/:id')
  @ApiOperation({ summary: 'Actualizar un documento de alquiler' })
  @ApiResponse({ status: 200, type: AlquilerDocumentoResultDto })
  updateDocumento(@Param('id', ParseIntPipe) id: number, @Body() data: AlquilerDocumentoUpdateDto) {
    return this.alquileresService.updateDocumento(id, data);
  }

  @Delete('documento/delete/:id')
  @ApiOperation({ summary: 'Eliminar un documento de alquiler' })
  @ApiResponse({ status: 200, type: AlquilerDocumentoResultDto })
  deleteDocumento(@Param('id', ParseIntPipe) id: number) {
    return this.alquileresService.deleteDocumento(id);
  }
}

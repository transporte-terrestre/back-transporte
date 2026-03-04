import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AlquileresService } from './alquileres.service';
import { AlquilerCreateDto } from './dto/alquiler/alquiler-create.dto';
import { AlquilerUpdateDto } from './dto/alquiler/alquiler-update.dto';
import { AlquilerQueryDto, AlquilerListDto } from './dto/alquiler/alquiler-list.dto';
import { AlquilerResultDto } from './dto/alquiler/alquiler-result.dto';

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
  @ApiResponse({ status: 201 })
  create(@Body() data: AlquilerCreateDto) {
    return this.alquileresService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un alquiler' })
  @ApiResponse({ status: 200 })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: AlquilerUpdateDto) {
    return this.alquileresService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un alquiler' })
  @ApiResponse({ status: 200 })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.alquileresService.delete(id);
  }
}

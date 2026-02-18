import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TalleresService } from './talleres.service';
import { PaginatedTallerResultDto, TallerPaginationQueryDto } from './dto/taller/taller-paginated.dto';
import { TallerResultDto } from './dto/taller/taller-result.dto';
import { TallerCreateDto } from './dto/taller/taller-create.dto';
import { TallerUpdateDto } from './dto/taller/taller-update.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('talleres')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('taller')
export class TalleresController {
  constructor(private readonly talleresService: TalleresService) {}

  @Post('create')
  @ApiOperation({ summary: 'Crear un nuevo taller' })
  create(@Body() createTallerDto: TallerCreateDto) {
    return this.talleresService.create(createTallerDto);
  }

  @Get('find-all')
  @ApiOperation({ summary: 'Listar talleres de forma paginada' })
  @ApiResponse({ status: 200, type: PaginatedTallerResultDto })
  findAll(@Query() query: TallerPaginationQueryDto) {
    return this.talleresService.findAllPaginated(query.page, query.limit, query.search, query.fechaInicio, query.fechaFin, query.tipo);
  }

  @Get('find-one/:id')
  @ApiOperation({ summary: 'Obtener un taller por ID' })
  @ApiResponse({ status: 200, type: TallerResultDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.talleresService.findOne(id);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Actualizar un taller por ID' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTallerDto: TallerUpdateDto) {
    return this.talleresService.update(id, updateTallerDto);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Eliminar un taller por ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.talleresService.remove(id);
  }
}

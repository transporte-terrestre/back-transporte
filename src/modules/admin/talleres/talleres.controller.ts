import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TalleresService } from './talleres.service';
import { PaginatedTallerResultDto, TallerPaginationQueryDto } from './dto/taller/taller-paginated.dto';
import { TallerResultDto } from './dto/taller/taller-result.dto';
import { TallerCreateDto } from './dto/taller/taller-create.dto';
import { TallerUpdateDto } from './dto/taller/taller-update.dto';
import { SucursalCreateDto } from './dto/sucursal/sucursal-create.dto';
import { SucursalUpdateDto } from './dto/sucursal/sucursal-update.dto';
import { SucursalResultDto } from './dto/sucursal/sucursal-result.dto';
import { PaginatedSucursalResultDto, SucursalPaginationQueryDto } from './dto/sucursal/sucursal-paginated.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('talleres')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('taller')
export class TalleresController {
  constructor(private readonly talleresService: TalleresService) {}

  // --- TALLERES ---
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

  // --- SUCURSALES ---
  @Post('sucursales/create')
  @ApiOperation({ summary: 'Crear una nueva sucursal de taller' })
  createSucursal(@Body() createSucursalDto: SucursalCreateDto) {
    return this.talleresService.createSucursal(createSucursalDto);
  }

  @Get('sucursales/find-all-paginated')
  @ApiOperation({ summary: 'Listar sucursales de forma paginada' })
  @ApiResponse({ status: 200, type: PaginatedSucursalResultDto })
  findAllSucursalesPaginated(@Query() query: SucursalPaginationQueryDto) {
    return this.talleresService.findAllSucursalesPaginated(query.page, query.limit, query.search, query.fechaInicio, query.fechaFin);
  }

  @Get('sucursales/find-all')
  @ApiOperation({ summary: 'Obtener todas las sucursales de talleres disponibles' })
  findAllSucursales() {
    return this.talleresService.findAllSucursales();
  }

  @Get('sucursales/find-one/:id')
  @ApiOperation({ summary: 'Obtener una sucursal por ID' })
  @ApiResponse({ status: 200, type: SucursalResultDto })
  findOneSucursal(@Param('id', ParseIntPipe) id: number) {
    return this.talleresService.findOneSucursal(id);
  }

  @Patch('sucursales/update/:id')
  @ApiOperation({ summary: 'Actualizar una sucursal por ID' })
  updateSucursal(@Param('id', ParseIntPipe) id: number, @Body() updateSucursalDto: SucursalUpdateDto) {
    return this.talleresService.updateSucursal(id, updateSucursalDto);
  }

  @Delete('sucursales/delete/:id')
  @ApiOperation({ summary: 'Eliminar una sucursal por ID' })
  removeSucursal(@Param('id', ParseIntPipe) id: number) {
    return this.talleresService.removeSucursal(id);
  }
}

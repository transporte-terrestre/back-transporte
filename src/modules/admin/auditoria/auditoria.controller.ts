import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuditoriaService } from './auditoria.service';
import { AuthGuard } from '@nestjs/passport';
import { AuditoriaQueryDto } from './dto/auditoria-query.dto';
import { PaginatedAuditoriaResultDto, AuditoriaResultDto } from './dto/auditoria-result.dto';

@ApiTags('auditorias')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('auditorias')
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Get('find-all')
  @ApiOperation({ summary: 'Obtener historial de auditoría del sistema (Solo Admin)' })
  @ApiResponse({ status: 200, type: PaginatedAuditoriaResultDto })
  async findAll(@Query() query: AuditoriaQueryDto) {
    return this.auditoriaService.findAllPaginated(
      query.page,
      query.limit,
      query.search,
      query.fechaInicio,
      query.fechaFin,
    );
  }

  @Get('find-one/:id')
  @ApiOperation({ summary: 'Obtener un registro de auditoría por ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID de la auditoría' })
  @ApiResponse({ status: 200, type: AuditoriaResultDto })
  async findOne(@Param('id') id: string) {
    return this.auditoriaService.findOne(+id);
  }
}

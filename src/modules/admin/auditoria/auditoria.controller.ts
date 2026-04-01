import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuditoriaService } from './auditoria.service';
import { AuthGuard } from '@nestjs/passport';
import { AuditoriaQueryDto } from './dto/auditoria-query.dto';
import { PaginatedAuditoriaResultDto } from './dto/auditoria-result.dto';

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
      query.page || 1, 
      query.limit || 10,
      query.search, 
      query.fechaInicio,
      query.fechaFin
    );
  }
}

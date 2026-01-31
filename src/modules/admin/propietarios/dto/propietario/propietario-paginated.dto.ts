import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { PropietarioListDto } from './propietario-list.dto';
import { PaginationMetaDto } from '@common/dto/pagination-meta.dto';
import { propietariosTipoDocumento } from '@db/tables/propietario.table';

export class PropietarioPaginationQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Número de página' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Registros por página' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'Juan',
    description: 'Búsqueda por nombre, dni, ruc, email, teléfono',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: '2023-01-01', description: 'Fecha inicio' })
  @IsOptional()
  @IsString()
  fechaInicio?: string;

  @ApiPropertyOptional({ example: '2023-12-31', description: 'Fecha fin' })
  @IsOptional()
  @IsString()
  fechaFin?: string;

  @ApiPropertyOptional({
    enum: propietariosTipoDocumento.enumValues,
    description: 'Filtrar por tipo de documento',
  })
  @IsOptional()
  @IsIn(propietariosTipoDocumento.enumValues)
  tipoDocumento?: string;
}

export class PaginatedPropietarioResultDto {
  @ApiProperty({ type: [PropietarioListDto] })
  data: PropietarioListDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

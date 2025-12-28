import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max, IsString, IsDateString } from 'class-validator';
import { ModeloListDto } from './modelo-list.dto';
import { PaginationMetaDto } from '../../../../common/dto/pagination-meta.dto';

export class ModeloPaginationQueryDto {
  @ApiProperty({
    description: 'Número de página (comienza en 1)',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Cantidad de elementos por página',
    example: 10,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Búsqueda por nombre de modelo',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de marca',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  marcaId?: number;

  @ApiPropertyOptional({
    description: 'Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @ApiPropertyOptional({
    description: 'Fecha de fin para filtrar por rango (formato: YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;
}

export class PaginatedModeloResultDto {
  @ApiProperty({
    description: 'Lista de modelos en la página actual',
    type: [ModeloListDto],
  })
  data: ModeloListDto[];

  @ApiProperty({
    description: 'Metadatos de la paginación',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}

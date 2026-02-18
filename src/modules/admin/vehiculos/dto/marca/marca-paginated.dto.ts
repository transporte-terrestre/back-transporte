import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max, IsString, IsDateString } from 'class-validator';
import { MarcaListDto } from './marca-list.dto';
import { PaginationMetaDto } from '../../../../../common/dto/pagination-meta.dto';

export class MarcaPaginationQueryDto {
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
    description: 'Búsqueda por nombre de marca',
  })
  @IsOptional()
  @IsString()
  search?: string;

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

export class PaginatedMarcaResultDto {
  @ApiProperty({
    description: 'Lista de marcas en la página actual',
    type: [MarcaListDto],
  })
  data: MarcaListDto[];

  @ApiProperty({
    description: 'Metadatos de la paginación',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}

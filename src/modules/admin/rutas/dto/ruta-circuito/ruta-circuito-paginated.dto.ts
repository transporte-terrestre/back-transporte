import { ApiProperty } from '@nestjs/swagger';
import { RutaCircuitoResultDto } from './ruta-circuito-result.dto';
import { PaginationMetaDto } from '../../../../../common/dto/pagination-meta.dto';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max, IsString, IsDateString } from 'class-validator';

export class RutaCircuitoPaginationQueryDto {
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

  @ApiProperty({
    description: 'Búsqueda por nombre del circuito',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @ApiProperty({
    description: 'Fecha de fin para filtrar por rango (formato: YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;
}

export class PaginatedRutaCircuitoResultDto {
  @ApiProperty({
    description: 'Lista de circuitos en la página actual',
    type: [RutaCircuitoResultDto],
  })
  data: RutaCircuitoResultDto[];

  @ApiProperty({
    description: 'Metadatos de la paginación',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}

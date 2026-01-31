import { ApiProperty } from '@nestjs/swagger';
import { ConductorListDto } from './conductor-list.dto';
import { PaginationMetaDto } from '../../../../common/dto/pagination-meta.dto';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max, IsString, IsDateString, IsIn } from 'class-validator';
import { conductoresClaseLicencia, conductoresCategoriaLicencia } from '@db/tables/conductor.table';
import type { ConductorClaseLicencia, ConductorCategoriaLicencia } from '@db/tables/conductor.table';

export class ConductorPaginationQueryDto {
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
    description: 'Búsqueda por nombre, DNI o número de licencia del conductor',
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

  @ApiProperty({
    description: 'Filtrar por clase de licencia',
    enum: conductoresClaseLicencia.enumValues,
    example: conductoresClaseLicencia.enumValues[0],
    required: false,
  })
  @IsOptional()
  @IsIn(conductoresClaseLicencia.enumValues, { each: true })
  claseLicencia?: ConductorClaseLicencia;

  @ApiProperty({
    description: 'Filtrar por categoría de licencia',
    enum: conductoresCategoriaLicencia.enumValues,
    example: conductoresCategoriaLicencia.enumValues[0],
    required: false,
  })
  @IsOptional()
  @IsIn(conductoresCategoriaLicencia.enumValues, { each: true })
  categoriaLicencia?: ConductorCategoriaLicencia;
}

export class PaginatedConductorResultDto {
  @ApiProperty({
    description: 'Lista de conductores en la página actual',
    type: [ConductorListDto],
  })
  data: ConductorListDto[];

  @ApiProperty({
    description: 'Metadatos de la paginación',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}

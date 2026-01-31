import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max, IsString, IsDateString, IsIn } from 'class-validator';
import { mantenimientosTipo, mantenimientosEstado } from '@db/tables/mantenimiento.model';
import type { MantenimientoTipo, MantenimientoEstado } from '@db/tables/mantenimiento.model';
import { PaginationMetaDto } from '../../../../common/dto/pagination-meta.dto';

export class MantenimientoPaginationQueryDto {
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
  @Max(1000)
  limit?: number = 10;

  @ApiProperty({
    description: 'Búsqueda por tipo, descripción o código de orden del mantenimiento',
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
    description: 'Filtrar por tipo de mantenimiento',
    enum: mantenimientosTipo.enumValues,
    example: mantenimientosTipo.enumValues[0],
    required: false,
  })
  @IsOptional()
  @IsIn(mantenimientosTipo.enumValues, { each: true })
  tipo?: MantenimientoTipo;

  @ApiProperty({
    description: 'Filtrar por estado del mantenimiento',
    enum: mantenimientosEstado.enumValues,
    example: mantenimientosEstado.enumValues[0],
    required: false,
  })
  @IsOptional()
  @IsIn(mantenimientosEstado.enumValues, { each: true })
  estado?: MantenimientoEstado;
}

import { MantenimientoListDto } from './mantenimiento-list.dto';

export class PaginatedMantenimientoResultDto {
  @ApiProperty({
    description: 'Lista de mantenimientos en la página actual',
    type: [MantenimientoListDto],
  })
  data: MantenimientoListDto[];

  @ApiProperty({
    description: 'Metadatos de la paginación',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}

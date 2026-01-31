import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max, IsString, IsDateString, IsIn } from 'class-validator';
import { talleresTipo } from '@db/tables/taller.model';
import type { TallerTipo } from '@db/tables/taller.model';
import { TallerListDto } from './taller-list.dto';
import { PaginationMetaDto } from '../../../../common/dto/pagination-meta.dto';

export class TallerPaginationQueryDto {
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
    description: 'Búsqueda por razón social, nombre comercial, RUC, teléfono o email',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Fecha de inicio para filtrar por fecha de creación (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @ApiProperty({
    description: 'Fecha de fin para filtrar por fecha de creación (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @ApiProperty({
    description: 'Filtrar por tipo de taller',
    enum: talleresTipo.enumValues,
    example: talleresTipo.enumValues[0],
    required: false,
  })
  @IsOptional()
  @IsIn(talleresTipo.enumValues, { each: true })
  tipo?: TallerTipo;
}

export class PaginatedTallerResultDto {
  @ApiProperty({
    description: 'Lista de talleres en la página actual',
    type: [TallerListDto],
  })
  data: TallerListDto[];

  @ApiProperty({
    description: 'Metadatos de la paginación',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}

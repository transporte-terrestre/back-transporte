import { ApiProperty } from '@nestjs/swagger';
import { VehiculoListDto } from './vehiculo-list.dto';
import { PaginationMetaDto } from '../../../../common/dto/pagination-meta.dto';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max, IsString, IsDateString, IsIn } from 'class-validator';
import { vehiculosEstado } from '@db/tables/vehiculo.table';
import type { VehiculoEstado } from '@db/tables/vehiculo.table';

export class VehiculoPaginationQueryDto {
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
    description: 'Búsqueda por placa, marca o modelo del vehículo',
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
    description: 'Filtrar por estado del vehículo',
    enum: vehiculosEstado.enumValues,
    example: vehiculosEstado.enumValues[0],
    required: false,
  })
  @IsOptional()
  @IsIn(vehiculosEstado.enumValues, { each: true })
  estado?: VehiculoEstado;
}

export class PaginatedVehiculoResultDto {
  @ApiProperty({
    description: 'Lista de vehículos en la página actual',
    type: [VehiculoListDto],
  })
  data: VehiculoListDto[];

  @ApiProperty({
    description: 'Metadatos de la paginación',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}

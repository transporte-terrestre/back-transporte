import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsInt, IsIn, IsOptional, IsString, Min } from 'class-validator';
import { AlquilerResultDto } from './alquiler-result.dto';
import { alquilerTipo, alquilerEstado } from '@db/tables/alquiler.table';
import type { AlquilerTipo, AlquilerEstado } from '@db/tables/alquiler.table';

export class AlquilerFiltersDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Filtrar por estado',
    enum: alquilerEstado.enumValues,
    required: false,
  })
  @IsOptional()
  @IsIn(alquilerEstado.enumValues)
  estado?: AlquilerEstado;

  @ApiProperty({ required: false })
  @Transform(({ value }) => (value != null ? parseInt(value, 10) : undefined))
  @IsInt()
  @IsOptional()
  clienteId?: number;

  @ApiProperty({
    description: 'Filtrar por tipo',
    enum: alquilerTipo.enumValues,
    required: false,
  })
  @IsOptional()
  @IsIn(alquilerTipo.enumValues, { each: true })
  tipo?: AlquilerTipo;


  @ApiProperty({ required: false })
  @Transform(({ value }) => (value != null ? parseInt(value, 10) : undefined))
  @IsInt()
  @IsOptional()
  conductorId?: number;

  @ApiProperty({ required: false })
  @Transform(({ value }) => (value != null ? parseInt(value, 10) : undefined))
  @IsInt()
  @IsOptional()
  vehiculoId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;
}

export class AlquilerQueryDto extends AlquilerFiltersDto {
  @ApiProperty({ required: false, default: 1 })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}

export class AlquilerItemDto extends AlquilerResultDto {}

export class AlquilerPaginationMetaDto {
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
  @ApiProperty() totalPages: number;
  @ApiProperty() hasNextPage: boolean;
  @ApiProperty() hasPreviousPage: boolean;
}

export class AlquilerListDto {
  @ApiProperty({ type: [AlquilerItemDto] })
  data: AlquilerItemDto[];

  @ApiProperty({ type: AlquilerPaginationMetaDto })
  meta: AlquilerPaginationMetaDto;
}

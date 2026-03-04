import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsInt, IsOptional, Min, Max, IsString, IsDateString, IsIn, IsArray, IsEnum } from 'class-validator';
import { modalidadServicio, viajesTipoRuta, viajesEstado, viajesSentido, viajesTurno } from '@db/tables/viaje.table';
import type { ViajeModalidadServicio, ViajeTipoRuta, ViajeEstado, ViajeSentido, ViajeTurno } from '@db/tables/viaje.table';
import { ViajeCircuitoResultDto, ViajeCircuitoLightResultDto } from '../viaje-circuito/viaje-circuito-result.dto';
import { ViajeLightResultDto } from './viaje-light-result.dto';
import { PaginationMetaDto } from '../../../../../common/dto/pagination-meta.dto';

export class ViajePaginationQueryDto {
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
    description: 'Búsqueda por ruta ocasional',
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
    description: 'Filtrar por modalidad de servicio',
    enum: modalidadServicio.enumValues,
    required: false,
  })
  @IsOptional()
  @IsIn(modalidadServicio.enumValues, { each: true })
  modalidadServicio?: ViajeModalidadServicio;

  @ApiProperty({
    description: 'Filtrar por tipo de ruta (ocasional, fija)',
    enum: viajesTipoRuta.enumValues,
    required: false,
  })
  @IsOptional()
  @IsIn(viajesTipoRuta.enumValues, { each: true })
  tipoRuta?: ViajeTipoRuta;

  @ApiProperty({
    description: 'Filtrar por estado del viaje',
    enum: viajesEstado.enumValues,
    required: false,
  })
  @IsOptional()
  @IsIn(viajesEstado.enumValues, { each: true })
  estado?: ViajeEstado;

  @ApiProperty({
    description: 'Filtrar por IDs de conductores (separados por coma)',
    example: '1,2,3',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',').map(Number) : value))
  @IsArray()
  @IsInt({ each: true })
  conductoresId?: number[];

  @ApiProperty({
    description: 'Filtrar por ID de cliente',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  clienteId?: number;

  @ApiProperty({
    description: 'Filtrar por ID de ruta',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  rutaId?: number;

  @ApiProperty({
    description: 'Filtrar por IDs de vehículos (separados por coma)',
    example: '1,2,3',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',').map(Number) : value))
  @IsArray()
  @IsInt({ each: true })
  vehiculosId?: number[];

  @ApiProperty({
    description: 'Filtrar por sentido del viaje',
    enum: viajesSentido.enumValues,
    required: false,
  })
  @IsOptional()
  @IsEnum(viajesSentido.enumValues)
  sentido?: ViajeSentido;

  @ApiProperty({
    description: 'Filtrar por turno del viaje',
    enum: viajesTurno.enumValues,
    required: false,
  })
  @IsOptional()
  @IsEnum(viajesTurno.enumValues)
  turno?: ViajeTurno;
}

export class PaginatedViajeResultDto {
  @ApiProperty({
    description: 'Lista de circuitos de viajes en la página actual',
    type: [ViajeCircuitoResultDto],
  })
  data: ViajeCircuitoResultDto[];

  @ApiProperty({
    description: 'Metadatos de la paginación',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}

export class PaginatedViajeLightResultDto {
  @ApiProperty({
    description: 'Lista de circuitos de viajes (formato ligero)',
    type: [ViajeCircuitoLightResultDto],
  })
  data: ViajeCircuitoLightResultDto[];

  @ApiProperty({
    description: 'Metadatos de la paginación',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}

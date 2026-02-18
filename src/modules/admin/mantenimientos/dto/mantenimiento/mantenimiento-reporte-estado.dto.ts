import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { PaginationMetaDto } from '../../../../../common/dto/pagination-meta.dto';

export class MantenimientoReporteEstadoDto {
  @ApiProperty({ example: 1, description: 'ID del vehículo' })
  vehiculoId: number;

  @ApiProperty({ example: 'ABC-123', description: 'Placa del vehículo' })
  placa: string;

  @ApiProperty({ example: 'V-001', description: 'Código interno del vehículo', nullable: true })
  codigoInterno: string | null;

  @ApiProperty({ example: ['url1', 'url2'], description: 'Imágenes del vehículo', nullable: true })
  imagenes: string[] | null;

  @ApiProperty({ example: 50000, description: 'Kilometraje actual del vehículo' })
  kilometrajeActual: number;

  @ApiProperty({ example: '2025-01-01', description: 'Fecha del último mantenimiento', nullable: true })
  ultimoMantenimientoFecha: Date | null;

  @ApiProperty({ example: 45000, description: 'Kilometraje en el último mantenimiento', nullable: true })
  ultimoMantenimientoKm: number | null;

  @ApiProperty({ example: 55000, description: 'Kilometraje programado para el próximo mantenimiento', nullable: true })
  proxMantenimientoKm: number | null;

  @ApiProperty({ example: 5000, description: 'Kilómetros restantes para el próximo mantenimiento', nullable: true })
  restante: number | null;

  @ApiProperty({ example: 5000, description: 'Kilómetros restantes para el próximo mantenimiento (alias)', nullable: true })
  kilometrajeRestante: number | null;

  @ApiProperty({ example: 'verde', description: 'Estado del mantenimiento (verde, amarillo, rojo)', enum: ['verde', 'amarillo', 'rojo', 'n/a'] })
  estado: string;
}

export enum ReporteEstadoSort {
  PROXIMOS = 'proximos',
  ULTIMOS = 'ultimos',
}

export class ReporteEstadoPaginationQueryDto {
  @ApiPropertyOptional({ minimum: 1, default: 1, description: 'Número de página' })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({ minimum: 1, default: 10, description: 'Elementos por página' })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit: number = 10;

  @ApiPropertyOptional({
    enum: ReporteEstadoSort,
    default: ReporteEstadoSort.PROXIMOS,
    description: 'Ordenamiento: proximos (menor kilometraje restante) o ultimos (mayor fecha de mantenimiento)',
  })
  @IsEnum(ReporteEstadoSort)
  @IsOptional()
  sort: ReporteEstadoSort = ReporteEstadoSort.PROXIMOS;
}

export class PaginatedReporteEstadoResultDto {
  @ApiProperty({ type: [MantenimientoReporteEstadoDto] })
  data: MantenimientoReporteEstadoDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

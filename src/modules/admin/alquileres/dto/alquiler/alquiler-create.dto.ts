import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean, ValidateNested, IsArray } from 'class-validator';
import { AlquilerDTO, alquilerTipo } from '@db/tables/alquiler.table';

export class AlquilerVehiculoDetalleDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  vehiculoId: number;

  @ApiProperty({ enum: alquilerTipo.enumValues, example: 'maquina_seca' })
  @IsEnum(alquilerTipo.enumValues)
  @IsNotEmpty()
  tipo: (typeof alquilerTipo.enumValues)[number];

  @ApiPropertyOptional({ description: 'Conductor requerido cuando el tipo es maquina_operada' })
  @IsInt()
  @IsOptional()
  conductorId?: number;

  @ApiProperty({ example: 15234.5 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  kilometrajeInicial: number;
}

export class AlquilerCreateDto
  implements
    Omit<
      AlquilerDTO,
      'id' | 'creadoEn' | 'actualizadoEn' | 'eliminadoEn' | 'estado' | 'montoTotalFinal'
    >
{
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  clienteId: number;

  @ApiProperty({ example: 450.0 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  montoPorDia: number;

  @ApiPropertyOptional({ description: 'Razón o motivo del alquiler' })
  @IsString()
  @IsOptional()
  razon?: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  fechaInicio: Date;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  fechaFin: Date | null;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsNotEmpty()
  esIndefinido: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  observaciones?: string | null;

  @ApiProperty({ type: [AlquilerVehiculoDetalleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AlquilerVehiculoDetalleDto)
  vehiculos: AlquilerVehiculoDetalleDto[];

  @ApiPropertyOptional({ description: 'Si es true, los vehículos cambiarán su estado a alquilado.' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  marcarComoAlquilado?: boolean;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';
import { AlquilerDTO, alquilerTipo } from '@db/tables/alquiler.table';

export class AlquilerCreateDto
  implements
    Omit<
      AlquilerDTO,
      'id' | 'creadoEn' | 'actualizadoEn' | 'eliminadoEn' | 'estado' | 'fechaFin' | 'conductorId' | 'kilometrajeFinal' | 'montoTotalFinal'
    >
{
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  clienteId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  vehiculoId: number;

  @ApiProperty({ enum: alquilerTipo.enumValues, example: 'maquina_seca' })
  @IsEnum(alquilerTipo.enumValues)
  @IsNotEmpty()
  tipo: (typeof alquilerTipo.enumValues)[number];

  @ApiProperty({ description: 'Conductor requerido cuando el tipo es maquina_operada' })
  @ValidateIf((o: AlquilerCreateDto) => o.tipo === 'maquina_operada')
  @IsInt()
  @IsNotEmpty()
  conductorId?: number;

  @ApiProperty({ example: 15234.5 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  kilometrajeInicial: number;

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

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  observaciones?: string | null;

  @ApiPropertyOptional({ description: 'Si es true, el vehículo cambiará su estado a alquilado.' })
  @IsOptional()
  @Type(() => Boolean)
  marcarComoAlquilado?: boolean;
}

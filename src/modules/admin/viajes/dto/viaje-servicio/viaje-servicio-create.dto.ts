import { IsInt, IsNotEmpty, IsOptional, IsString, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ViajeServicioDTO } from '@db/tables/viaje-servicio.table';

export class ViajeServicioCreateDto implements Omit<ViajeServicioDTO, 'id' | 'viajeId' | 'orden' | 'creadoEn' | 'actualizadoEn'> {
  @ApiPropertyOptional({ example: 'trayecto', description: 'Tipo de servicio (trayecto o descanso)' })
  @IsOptional()
  @IsEnum(['trayecto', 'descanso'])
  tipo?: 'trayecto' | 'descanso';

  @ApiPropertyOptional({ example: -77.0282, description: 'Longitud de la ubicación' })
  @IsOptional()
  @IsNumber()
  longitud?: number;

  @ApiPropertyOptional({ example: -12.0432, description: 'Latitud de la ubicación' })
  @IsOptional()
  @IsNumber()
  latitud?: number;

  @ApiPropertyOptional({ example: 'Parada 1', description: 'Nombre del lugar o descriptivo' })
  @IsOptional()
  @IsString()
  nombreLugar?: string;

  @ApiPropertyOptional({ example: '2024-03-24T10:30:00Z', description: 'Hora final del trayecto o descanso' })
  @IsOptional()
  @IsDateString()
  horaFinal?: Date;

  @ApiPropertyOptional({ example: 94891, description: 'Kilometraje final del odómetro' })
  @IsOptional()
  @IsNumber()
  kilometrajeFinal?: number;

  @ApiPropertyOptional({ example: 12, description: 'Número de pasajeros transportados' })
  @IsOptional()
  @IsInt()
  numeroPasajeros?: number;

  @ApiPropertyOptional({ example: 'Servicio sin novedad', description: 'Observaciones del servicio o descanso' })
  @IsOptional()
  @IsString()
  observaciones?: string;
}

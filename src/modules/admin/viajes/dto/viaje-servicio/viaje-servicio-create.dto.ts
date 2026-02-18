import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ViajeServicioDTO } from '@db/tables/viaje-servicio.table';

export class ViajeServicioCreateDto implements Omit<ViajeServicioDTO, 'id' | 'viajeId' | 'orden' | 'creadoEn' | 'actualizadoEn'> {
  @ApiProperty({ example: 1, description: 'ID de la parada de partida' })
  @IsNotEmpty()
  @IsInt()
  paradaPartidaId: number;

  @ApiProperty({ example: 2, description: 'ID de la parada de llegada' })
  @IsNotEmpty()
  @IsInt()
  paradaLlegadaId: number;

  @ApiProperty({ example: '06:45', description: 'Hora de salida (formato HH:mm)' })
  @IsNotEmpty()
  @IsString()
  horaSalida: string;

  @ApiPropertyOptional({ example: '07:45', description: 'Hora de término (formato HH:mm)' })
  @IsOptional()
  @IsString()
  horaTermino?: string;

  @ApiProperty({ example: 94880, description: 'Kilometraje inicial del odómetro' })
  @IsNotEmpty()
  @IsInt()
  kmInicial: number;

  @ApiPropertyOptional({ example: 94891, description: 'Kilometraje final del odómetro' })
  @IsOptional()
  @IsInt()
  kmFinal?: number;

  @ApiPropertyOptional({ example: 12, description: 'Número de pasajeros transportados' })
  @IsOptional()
  @IsInt()
  numeroPasajeros?: number;

  @ApiPropertyOptional({ example: 'Servicio sin novedad', description: 'Observaciones del servicio' })
  @IsOptional()
  @IsString()
  observaciones?: string;
}

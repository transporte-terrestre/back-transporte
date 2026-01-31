import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ViajeServicioDTO } from '@db/tables/viaje-servicio.table';

export class ViajeServicioCreateDto implements Omit<ViajeServicioDTO, 'id' | 'viajeId' | 'orden' | 'creadoEn' | 'actualizadoEn'> {
  @ApiPropertyOptional({ example: 1, description: 'ID de la parada de partida (si es fija)' })
  @IsOptional()
  @IsInt()
  paradaPartidaId?: number;

  @ApiPropertyOptional({
    example: 'Cochera Chorrillos',
    description: 'Nombre de la parada de partida ocasional',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  paradaPartidaOcasional?: string;

  @ApiPropertyOptional({ example: 2, description: 'ID de la parada de llegada (si es fija)' })
  @IsOptional()
  @IsInt()
  paradaLlegadaId?: number;

  @ApiPropertyOptional({
    example: 'PEIP - Educans',
    description: 'Nombre de la parada de llegada ocasional',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  paradaLlegadaOcasional?: string;

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

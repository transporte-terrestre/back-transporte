import { IsOptional, IsNumber, IsDate, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ViajeRegistrarDescansoDto {
  @ApiPropertyOptional({ example: -77.0282, description: 'Longitud de la ubicación actual' })
  @IsOptional()
  @IsNumber()
  longitud?: number;

  @ApiPropertyOptional({ example: -12.0432, description: 'Latitud de la ubicación actual' })
  @IsOptional()
  @IsNumber()
  latitud?: number;

  @ApiProperty({ example: '2024-03-24T10:30:00Z', description: 'Hora actual del registro' })
  @IsDate()
  @Type(() => Date)
  horaActual: Date;

  @ApiPropertyOptional({ example: 'Descanso', description: 'Nombre del lugar o parada' })
  @IsOptional()
  @IsString()
  nombreLugar?: string;

  @ApiPropertyOptional({ example: 94891, description: 'Kilometraje actual del odómetro' })
  @IsOptional()
  @IsNumber()
  kilometrajeActual?: number;

  @ApiPropertyOptional({ example: 0, description: 'Cantidad de pasajeros' })
  @IsOptional()
  @IsInt()
  cantidadPasajeros?: number;
}

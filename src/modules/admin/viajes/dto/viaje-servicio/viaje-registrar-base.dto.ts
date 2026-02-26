import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDate, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ViajeRegistrarBaseDto {
  @ApiProperty({ example: -77.0282, description: 'Longitud de la ubicación actual' })
  @IsNotEmpty()
  @IsNumber()
  longitud: number;

  @ApiProperty({ example: -12.0432, description: 'Latitud de la ubicación actual' })
  @IsNotEmpty()
  @IsNumber()
  latitud: number;

  @ApiProperty({ example: 12, description: 'Cantidad de pasajeros' })
  @IsNotEmpty()
  @IsInt()
  cantidadPasajeros: number;

  @ApiProperty({ example: '2024-03-24T10:30:00Z', description: 'Hora actual del registro' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  horaActual: Date;

  @ApiProperty({ example: 94891, description: 'Kilometraje actual del odómetro' })
  @IsNotEmpty()
  @IsNumber()
  kilometrajeActual: number;

  @ApiPropertyOptional({ example: 'Terminal Terrestre', description: 'Nombre del lugar o parada (opcional)' })
  @IsOptional()
  @IsString()
  nombreLugar?: string;
}

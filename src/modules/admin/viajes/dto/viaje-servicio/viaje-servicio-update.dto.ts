import { IsInt, IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ViajeServicioUpdateDto {
  @ApiPropertyOptional({ example: 'Terminal Terrestre', description: 'Nombre del lugar o parada' })
  @IsOptional()
  @IsString()
  nombreLugar?: string;

  @ApiPropertyOptional({ example: '2024-03-24T10:30:00Z', description: 'Hora final del registro' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  horaFinal?: Date;

  @ApiPropertyOptional({ example: 94891, description: 'Kilometraje final del odómetro' })
  @IsOptional()
  @IsNumber()
  kilometrajeFinal?: number;

  @ApiPropertyOptional({ example: 12, description: 'Número de pasajeros transportados' })
  @IsOptional()
  @IsInt()
  numeroPasajeros?: number;
}

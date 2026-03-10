import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AlquilerTerminarDto {
  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  fechaFin: Date;

  @ApiProperty({ example: 15820.5 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  kilometrajeFinal: number;

  @ApiProperty({ example: 2500.0 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  montoTotalFinal: number;

  @ApiPropertyOptional({ description: 'Observaciones finales del cierre del alquiler' })
  @IsString()
  @IsOptional()
  observaciones?: string;
}

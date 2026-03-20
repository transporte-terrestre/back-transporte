import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AlquilerTerminarDto {
  @ApiPropertyOptional({ description: 'ID del detalle del alquiler a finalizar. Si no se envía se finaliza todo el contrato (maestro).' })
  @IsNumber()
  @IsOptional()
  detalleId?: number;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  fechaFin: Date;

  @ApiPropertyOptional({ example: 15820.5 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  kilometrajeFinal?: number;

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

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class AlquilerTerminarDetalleDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  detalleId: number;

  @ApiPropertyOptional({ example: 15820.5 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  kilometrajeFinal?: number;
}

export class AlquilerTerminarDto {
  @ApiPropertyOptional({ type: [AlquilerTerminarDetalleDto], description: 'Lista de detalles a finalizar. Si no se envía se finaliza todo el contrato maestro.' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AlquilerTerminarDetalleDto)
  @IsOptional()
  detalles?: AlquilerTerminarDetalleDto[];

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  fechaFin: Date;

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

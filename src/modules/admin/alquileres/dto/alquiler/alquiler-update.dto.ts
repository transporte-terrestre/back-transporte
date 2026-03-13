import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { AlquilerCreateDto } from './alquiler-create.dto';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { alquilerEstado } from '@db/tables/alquiler.table';
import type { AlquilerEstado } from '@db/tables/alquiler.table';

export class AlquilerUpdateDto extends PartialType(AlquilerCreateDto) {
  @ApiPropertyOptional({ enum: alquilerEstado.enumValues })
  @IsOptional()
  @IsEnum(alquilerEstado.enumValues)
  estado?: AlquilerEstado;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaFin?: Date | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  kilometrajeFinal?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  montoTotalFinal?: number | null;
}

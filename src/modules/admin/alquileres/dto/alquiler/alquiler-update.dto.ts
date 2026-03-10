import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { AlquilerCreateDto } from './alquiler-create.dto';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AlquilerUpdateDto extends PartialType(AlquilerCreateDto) {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  estado?: string;

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

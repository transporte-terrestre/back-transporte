import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import type { ViajeTramoTipo } from '@db/tables/viaje-tramo.table';

export class ViajeTramoUpdateDto {
  @ApiProperty({ enum: ['origen', 'punto', 'parada', 'descanso', 'destino'], required: false })
  @IsEnum(['origen', 'punto', 'parada', 'descanso', 'destino'])
  @IsOptional()
  tipo?: ViajeTramoTipo;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  longitud?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  latitud?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nombreLugar?: string;

  @ApiProperty({ required: false, example: '2024-03-24T10:30:00Z' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  horaFinal?: Date;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  kilometrajeFinal?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  numeroPasajeros?: number;
}

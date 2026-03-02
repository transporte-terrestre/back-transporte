import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { AlquilerDTO } from '@db/tables/alquiler.table';

export class AlquilerCreateDto implements Omit<AlquilerDTO, 'id' | 'creadoEn' | 'actualizadoEn' | 'eliminadoEn' | 'estado'> {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  vehiculoId: number;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  fechaInicio: Date;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaFin?: Date | null;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  monto?: string | null;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  observaciones?: string | null;
}

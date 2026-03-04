import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class ValidarConductorQueryDto {
  @ApiProperty({ description: 'ID del conductor a validar' })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  conductorId: number;

  @ApiProperty({ description: 'Fecha de salida programada' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  fechaSalida: Date;

  @ApiProperty({ description: 'Fecha de llegada programada' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  fechaLlegada: Date;

  @ApiPropertyOptional({ description: 'ID del viaje actual (para excluirlo de la validación de cruces)' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  viajeId?: number;
}

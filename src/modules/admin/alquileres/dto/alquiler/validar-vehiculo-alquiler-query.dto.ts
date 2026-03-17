import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class ValidarVehiculoAlquilerQueryDto {
  @ApiProperty({ description: 'ID del vehículo a validar' })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  vehiculoId: number;

  @ApiProperty({ description: 'Fecha de inicio del alquiler' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  fechaInicio: Date;

  @ApiPropertyOptional({ description: 'Fecha de fin del alquiler' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaFin?: Date;

  @ApiPropertyOptional({ description: 'ID del alquiler actual (para excluirlo de la validación de cruces)' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  alquilerId?: number;
}

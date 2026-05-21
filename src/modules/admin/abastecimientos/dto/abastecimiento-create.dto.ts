import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { combustibleEnum } from '@db/tables/vehiculo.table';
import type { CombustibleTipo } from '@db/tables/vehiculo.table';

export class AbastecimientoCreateDto {
  @ApiProperty({ example: 1, description: 'ID del vehiculo abastecido' })
  @IsInt()
  vehiculoId: number;

  @ApiPropertyOptional({ example: 10, description: 'ID del tramo asociado, si el abastecimiento ocurrió durante un viaje' })
  @IsOptional()
  @IsInt()
  viajeTramoId?: number | null;

  @ApiProperty({ example: 'diesel', enum: combustibleEnum.enumValues, description: 'Tipo de combustible' })
  @IsEnum(combustibleEnum.enumValues, { message: 'El tipo de combustible no es válido' })
  combustible: CombustibleTipo;

  @ApiProperty({ example: 10.5, description: 'Galones abastecidos' })
  @IsNumber()
  @Min(0.01)
  galonesEstablecidos: number;
}

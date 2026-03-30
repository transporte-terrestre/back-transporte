import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsNumber, Min } from 'class-validator';
import { combustibleEnum } from '@db/tables/vehiculo.table';
import type { CombustibleTipo } from '@db/tables/vehiculo.table';

export class ViajeRepostajeMovimientoCreateDto {
  @ApiProperty({ example: 1, description: 'ID del tramo del viaje' })
  @IsNotEmpty()
  @IsNumber()
  viajeTramoId: number;

  @ApiProperty({ example: 'diesel', enum: combustibleEnum.enumValues, description: 'Tipo de combustible' })
  @IsNotEmpty()
  @IsEnum(combustibleEnum.enumValues, { message: 'El tipo de combustible no es válido' })
  combustible: CombustibleTipo;

  @ApiProperty({ example: 10.5, description: 'Galones establecidos' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  galonesEstablecidos: number;
}

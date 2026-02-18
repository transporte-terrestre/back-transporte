import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsBoolean, IsOptional } from 'class-validator';
import { viajeVehiculosRol } from '@db/tables/viaje-vehiculo.table';
import type { ViajeVehiculoRol } from '@db/tables/viaje-vehiculo.table';

export class ViajeVehiculoUpdateDto {
  @ApiProperty({
    example: true,
    description: 'Indica si es el vehículo principal',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  esPrincipal?: boolean;

  @ApiProperty({
    enum: viajeVehiculosRol.enumValues,
    description: 'Rol del vehículo en el viaje',
    default: viajeVehiculosRol.enumValues[0],
    required: false,
  })
  @IsIn(viajeVehiculosRol.enumValues, { each: true })
  @IsOptional()
  rol?: ViajeVehiculoRol;
}

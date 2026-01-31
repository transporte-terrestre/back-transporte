import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsIn, IsBoolean, IsOptional } from 'class-validator';
import { ViajeVehiculoDTO, viajeVehiculosRol } from '@db/tables/viaje-vehiculo.model';
import type { ViajeVehiculoRol } from '@db/tables/viaje-vehiculo.model';

export class ViajeVehiculoCreateDto implements Omit<ViajeVehiculoDTO, 'creadoEn' | 'actualizadoEn'> {
  @ApiProperty({ example: 1, description: 'ID del viaje' })
  @IsInt()
  @IsNotEmpty()
  viajeId: number;

  @ApiProperty({ example: 1, description: 'ID del vehículo' })
  @IsInt()
  @IsNotEmpty()
  vehiculoId: number;

  @ApiProperty({
    example: true,
    description: 'Indica si es el vehículo principal',
    default: false,
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
  rol: ViajeVehiculoRol;
}

import { ApiProperty } from '@nestjs/swagger';
import { viajeVehiculosRol } from '@db/tables/viaje-vehiculo.table';
import type { ViajeVehiculoRol } from '@db/tables/viaje-vehiculo.table';

export class ViajeVehiculoResultDto {
  @ApiProperty({ example: 1, description: 'ID del viaje' })
  viajeId: number;

  @ApiProperty({ example: 1, description: 'ID del vehículo' })
  vehiculoId: number;

  @ApiProperty({
    example: true,
    description: 'Indica si es el vehículo principal',
  })
  esPrincipal: boolean;

  @ApiProperty({
    enum: viajeVehiculosRol.enumValues,
    description: 'Rol del vehículo en el viaje',
    example: viajeVehiculosRol.enumValues[0],
  })
  rol: ViajeVehiculoRol;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Fecha de creación',
  })
  creadoEn: Date;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Fecha de última actualización',
  })
  actualizadoEn: Date;
}

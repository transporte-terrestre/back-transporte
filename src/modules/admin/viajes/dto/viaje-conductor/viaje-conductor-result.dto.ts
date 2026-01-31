import { ApiProperty } from '@nestjs/swagger';
import { viajeConductoresRol } from '@db/tables/viaje-conductor.table';
import type { ViajeConductorRol } from '@db/tables/viaje-conductor.table';

export class ViajeConductorResultDto {
  @ApiProperty({ example: 1, description: 'ID del viaje' })
  viajeId: number;

  @ApiProperty({ example: 1, description: 'ID del conductor' })
  conductorId: number;

  @ApiProperty({
    example: true,
    description: 'Indica si es el conductor principal',
  })
  esPrincipal: boolean;

  @ApiProperty({
    enum: viajeConductoresRol.enumValues,
    description: 'Rol del conductor en el viaje',
    example: 'conductor',
  })
  rol: ViajeConductorRol;

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

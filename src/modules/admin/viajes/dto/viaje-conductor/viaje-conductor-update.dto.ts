import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsBoolean, IsOptional } from 'class-validator';
import { viajeConductoresRol } from '@db/tables/viaje-conductor.table';
import type { ViajeConductorRol } from '@db/tables/viaje-conductor.table';

export class ViajeConductorUpdateDto {
  @ApiProperty({
    example: true,
    description: 'Indica si es el conductor principal',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  esPrincipal?: boolean;

  @ApiProperty({
    enum: viajeConductoresRol.enumValues,
    description: 'Rol del conductor en el viaje',
    default: viajeConductoresRol.enumValues[0],
    required: false,
  })
  @IsIn(viajeConductoresRol.enumValues, { each: true })
  @IsOptional()
  rol?: ViajeConductorRol;
}

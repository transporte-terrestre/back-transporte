import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsIn, IsBoolean, IsOptional } from 'class-validator';
import { ViajeConductorDTO, viajeConductoresRol } from '@db/tables/viaje-conductor.model';
import type { ViajeConductorRol } from '@db/tables/viaje-conductor.model';

export class ViajeConductorCreateDto implements Omit<ViajeConductorDTO, 'creadoEn' | 'actualizadoEn'> {
  @ApiProperty({ example: 1, description: 'ID del viaje' })
  @IsInt()
  @IsNotEmpty()
  viajeId: number;

  @ApiProperty({ example: 1, description: 'ID del conductor' })
  @IsInt()
  @IsNotEmpty()
  conductorId: number;

  @ApiProperty({
    example: true,
    description: 'Indica si es el conductor principal',
    default: false,
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
  rol: ViajeConductorRol;
}

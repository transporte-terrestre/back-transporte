import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { combustibleEnum } from '@db/tables/vehiculo.table';
import type { CombustibleTipo } from '@db/tables/vehiculo.table';

export class AbastecimientoUbicacionDto {
  @ApiProperty({ example: -12.121907562533325 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({ example: -76.9966634621533 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;
}

export class AbastecimientoMetadataDto {
  @ApiProperty({ type: AbastecimientoUbicacionDto })
  @ValidateNested()
  @Type(() => AbastecimientoUbicacionDto)
  ubicacion: AbastecimientoUbicacionDto;
}

export class AbastecimientoCreateDto {
  @ApiProperty({ example: 1, description: 'ID del vehiculo abastecido' })
  @IsInt()
  vehiculoId: number;

  @ApiPropertyOptional({ example: 10, description: 'ID del tramo asociado, si el abastecimiento ocurrió durante un viaje' })
  @IsOptional()
  @IsInt()
  viajeTramoId?: number | null;

  @ApiPropertyOptional({ example: 45952.5, nullable: true, description: 'Kilometraje registrado en un abastecimiento sin viaje' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  kilometrajeSuelto?: number | null;

  @ApiPropertyOptional({ example: 'Grifo Repsol - Av. Principal', nullable: true, description: 'Tramo o lugar de un abastecimiento sin viaje' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  tramoSuelto?: string | null;

  @ApiPropertyOptional({
    example: '2026-08-27T14:35:00.000Z',
    format: 'date-time',
    nullable: true,
    description: 'Fecha y hora operativa del abastecimiento sin viaje',
  })
  @IsOptional()
  @IsDateString()
  fechaAbastecimiento?: string | null;

  @ApiPropertyOptional({ type: AbastecimientoMetadataDto, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => AbastecimientoMetadataDto)
  metadata?: AbastecimientoMetadataDto | null;

  @ApiProperty({ example: 'diesel', enum: combustibleEnum.enumValues, description: 'Tipo de combustible' })
  @IsEnum(combustibleEnum.enumValues, { message: 'El tipo de combustible no es válido' })
  combustible: CombustibleTipo;

  @ApiProperty({ example: 10.5, description: 'Galones abastecidos' })
  @IsNumber()
  @Min(0.01)
  galonesEstablecidos: number;
}

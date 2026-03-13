import { IsInt, IsIn, IsNotEmpty, IsDate, IsOptional, IsString, IsArray, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ViajeDTO, viajesEstado, viajesModalidadServicio, viajesTipoRuta, viajesTurno, viajesSentido } from '@db/tables/viaje.table';
import type { ViajeEstado, ViajeModalidadServicio, ViajeTipoRuta, ViajeTurno } from '@db/tables/viaje.table';

export class ViajeDetalleCreateDto implements Omit<ViajeDTO, 'id' | 'creadoEn' | 'actualizadoEn' | 'eliminadoEn'> {
  @ApiPropertyOptional({ example: 1, description: 'ID de la ruta programada' })
  @IsOptional()
  @IsInt()
  rutaId?: number;

  @ApiPropertyOptional({
    example: 'Lima - Arequipa (Ocasional)',
    description: 'Descripción de ruta ocasional',
  })
  @IsOptional()
  @IsString()
  rutaOcasional?: string;

  @ApiPropertyOptional({
    example: '450.00',
    description: 'Distancia estimada del viaje en km',
  })
  @IsOptional()
  @IsString()
  distanciaEstimada?: string;

  @ApiPropertyOptional({
    example: '455.50',
    description: 'Distancia real al final del viaje en km',
  })
  @IsOptional()
  @IsString()
  distanciaFinal?: string;

  @ApiPropertyOptional({
    enum: viajesTipoRuta.enumValues,
    description: 'Tipo de ruta (fija, ocasional)',
    default: viajesTipoRuta.enumValues[1],
  })
  @IsOptional()
  @IsIn(viajesTipoRuta.enumValues, { each: true })
  tipoRuta: ViajeTipoRuta;

  @ApiProperty({ example: 1, description: 'ID del cliente' })
  @IsInt()
  @IsNotEmpty()
  clienteId: number;

  @ApiPropertyOptional({ example: 1, description: 'ID de la entidad (opcional)' })
  @IsOptional()
  @IsInt()
  entidadId?: number;

  @ApiPropertyOptional({
    enum: viajesModalidadServicio.enumValues,
    description: 'Modalidad de servicio',
    default: viajesModalidadServicio.enumValues[0],
  })
  @IsOptional()
  @IsIn(viajesModalidadServicio.enumValues, { each: true })
  modalidadServicio?: ViajeModalidadServicio;

  @ApiPropertyOptional({
    example: '8.00',
    description: 'Horas contratadas (si no se especifica, se toma del cliente)',
  })
  @IsOptional()
  @IsString()
  horasContrato?: string;

  @ApiProperty({
    example: '2025-01-01T10:00:00Z',
    description: 'Scheduled departure date',
  })
  @IsDate()
  @Type(() => Date)
  fechaSalidaProgramada: Date;

  @ApiPropertyOptional({
    example: '2025-01-01T18:00:00Z',
    description: 'Scheduled arrival date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaLlegadaProgramada?: Date | null;

  @ApiPropertyOptional({
    enum: viajesEstado.enumValues,
    description: 'Estado del viaje',
    default: viajesEstado.enumValues[0],
  })
  @IsOptional()
  @IsIn(viajesEstado.enumValues, { each: true })
  estado: ViajeEstado;

  @ApiPropertyOptional({
    enum: viajesTurno.enumValues,
    description: 'Turno del viaje (día o noche)',
    example: 'dia',
  })
  @IsOptional()
  @IsIn(viajesTurno.enumValues, { each: true })
  turno?: ViajeTurno;

  @ApiPropertyOptional({
    enum: viajesSentido.enumValues,
    description: 'Sentido del viaje (ida o vuelta)',
    default: 'ida',
  })
  @IsOptional()
  @IsIn(viajesSentido.enumValues, { each: true })
  sentido?: 'ida' | 'vuelta' | 'circuito';

  @ApiPropertyOptional({
    example: '242155',
    description: 'Número de vale de combustible',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  numeroVale?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID del conductor principal',
  })
  @IsOptional()
  @IsInt()
  conductorId?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID del vehículo principal' })
  @IsOptional()
  @IsInt()
  vehiculoId?: number;

  @ApiPropertyOptional({ description: 'Datos adicionales del viaje (metadata)' })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class ViajeCreateDto {
  @ApiPropertyOptional({ type: ViajeDetalleCreateDto, description: 'Viaje de ida' })
  @ValidateNested()
  @Type(() => ViajeDetalleCreateDto)
  @IsOptional()
  ida?: ViajeDetalleCreateDto;

  @ApiPropertyOptional({ type: ViajeDetalleCreateDto, description: 'Viaje de vuelta' })
  @ValidateNested()
  @Type(() => ViajeDetalleCreateDto)
  @IsOptional()
  vuelta?: ViajeDetalleCreateDto;
}

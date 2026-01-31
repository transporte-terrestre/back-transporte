import { IsInt, IsIn, IsNotEmpty, IsDate, IsOptional, IsString, IsArray, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ViajeDTO, viajesEstado, modalidadServicio, viajesTipoRuta, viajesTurno } from '@db/tables/viaje.table';
import type { ViajeEstado, ViajeModalidadServicio, ViajeTipoRuta, ViajeTurno } from '@db/tables/viaje.table';

export class ViajeCreateDto implements Omit<ViajeDTO, 'id' | 'creadoEn' | 'actualizadoEn'> {
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

  @ApiPropertyOptional({
    example: ['Juan Pérez', 'María García'],
    description: 'Lista de tripulantes',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tripulantes?: string[];

  @ApiPropertyOptional({
    enum: modalidadServicio.enumValues,
    description: 'Modalidad de servicio',
    default: modalidadServicio.enumValues[0],
  })
  @IsOptional()
  @IsIn(modalidadServicio.enumValues, { each: true })
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
    description: 'Departure date',
  })
  @IsDate()
  @Type(() => Date)
  fechaSalida: Date;

  @ApiPropertyOptional({
    example: '2025-01-01T18:00:00Z',
    description: 'Arrival date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaLlegada: Date | null;

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
}

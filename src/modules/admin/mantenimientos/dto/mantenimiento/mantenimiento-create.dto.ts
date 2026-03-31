import { IsInt, IsNumber, IsString, IsNotEmpty, IsIn, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MantenimientoDTO, mantenimientosTipo, mantenimientosEstado } from '@db/tables/mantenimiento.table';
import type { MantenimientoTipo, MantenimientoEstado } from '@db/tables/mantenimiento.table';

export class MantenimientoCreateDto implements Omit<MantenimientoDTO, 'id' | 'creadoEn' | 'actualizadoEn' | 'codigoOrden'> {
  @ApiProperty({ example: 1, description: 'Vehicle ID' })
  @IsInt()
  @IsNotEmpty()
  vehiculoId: number;

  @ApiPropertyOptional({ example: 1, description: 'Workshop ID' })
  @IsInt()
  @IsOptional()
  tallerId?: number;

  @ApiPropertyOptional({ example: 1, description: 'Branch ID' })
  @IsInt()
  @IsOptional()
  sucursalId?: number;

  @ApiProperty({
    enum: mantenimientosTipo.enumValues,
    default: mantenimientosTipo.enumValues[0],
    description: 'Maintenance type',
  })
  @IsIn(mantenimientosTipo.enumValues, { each: true })
  tipo: MantenimientoTipo;

  @ApiProperty({ example: '150.50', description: 'Total Cost' })
  @IsString()
  @IsNotEmpty()
  costoTotal: string;

  @ApiProperty({ example: 'Cambio de aceite', description: 'Description' })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({
    example: '2025-01-15T10:00:00Z',
    description: 'Date of entry',
  })
  @IsDate()
  @Type(() => Date)
  fechaIngreso: Date;

  @ApiProperty({ example: '2025-01-16T18:00:00Z', description: 'Date of exit' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaSalida: Date | null;

  @ApiProperty({ example: 55000.5, description: 'Mileage at maintenance' })
  @IsNumber()
  kilometraje: number;

  @ApiProperty({ example: 60000.5, description: 'Next maintenance mileage' })
  @IsOptional()
  @IsNumber()
  kilometrajeProximoMantenimiento?: number;

  @ApiProperty({
    enum: mantenimientosEstado.enumValues,
    default: mantenimientosEstado.enumValues[0],
    description: 'Status',
  })
  @IsIn(mantenimientosEstado.enumValues, { each: true })
  @IsOptional()
  estado: MantenimientoEstado;

  @ApiPropertyOptional({ description: 'Si es true, el vehículo cambiará su estado a taller.' })
  @IsOptional()
  @Type(() => Boolean)
  marcarEnTaller?: boolean;
}

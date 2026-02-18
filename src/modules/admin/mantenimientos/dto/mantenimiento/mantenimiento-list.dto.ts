import { ApiProperty, OmitType } from '@nestjs/swagger';
import { mantenimientosTipo, mantenimientosEstado } from '@db/tables/mantenimiento.table';
import type { MantenimientoTipo, MantenimientoEstado } from '@db/tables/mantenimiento.table';
import { VehiculoResultDto } from '../../../vehiculos/dto/vehiculo/vehiculo-result.dto';
import { TallerResultDto } from '../../../talleres/dto/taller/taller-result.dto';

export class VehiculoMantenimientoListDto extends OmitType(VehiculoResultDto, ['documentos', 'propietarios', 'proveedores']) {}

export class MantenimientoListDto {
  @ApiProperty({ example: 1, description: 'Maintenance ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Vehicle ID' })
  vehiculoId: number;

  @ApiProperty({
    type: () => VehiculoMantenimientoListDto,
    description: 'Vehicle details',
  })
  vehiculo: VehiculoMantenimientoListDto;

  @ApiProperty({ example: 1, description: 'Workshop ID' })
  tallerId: number;

  @ApiProperty({
    type: () => TallerResultDto,
    description: 'Workshop details',
  })
  taller: TallerResultDto;

  @ApiProperty({ example: 'ORD-001', description: 'Service Order Code' })
  codigoOrden: string | null;

  @ApiProperty({
    enum: mantenimientosTipo.enumValues,
    example: mantenimientosTipo.enumValues[0],
    description: 'Maintenance type',
  })
  tipo: MantenimientoTipo;

  @ApiProperty({ example: '150.50', description: 'Total Cost' })
  costoTotal: string;

  @ApiProperty({ example: 'Cambio de aceite', description: 'Description' })
  descripcion: string;

  @ApiProperty({
    example: '2025-01-15T10:00:00Z',
    description: 'Date of entry',
  })
  fechaIngreso: Date;

  @ApiProperty({ example: '2025-01-16T18:00:00Z', description: 'Date of exit' })
  fechaSalida: Date | null;

  @ApiProperty({ example: 55000, description: 'Mileage at maintenance' })
  kilometraje: number;

  @ApiProperty({
    enum: mantenimientosEstado.enumValues,
    example: mantenimientosEstado.enumValues[0],
    description: 'Status',
  })
  estado: MantenimientoEstado;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Creation date',
  })
  creadoEn: Date;

  @ApiProperty({
    example: '2023-01-02T00:00:00.000Z',
    description: 'Update date',
  })
  actualizadoEn: Date;

  @ApiProperty({
    example: null,
    description: 'Deletion date (if applicable)',
    nullable: true,
  })
  eliminadoEn: Date | null;
}

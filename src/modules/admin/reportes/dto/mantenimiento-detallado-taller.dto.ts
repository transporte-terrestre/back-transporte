import { ApiProperty } from '@nestjs/swagger';
import { mantenimientosMoneda } from '@db/tables/mantenimiento.table';
import type { MantenimientoMoneda } from '@db/tables/mantenimiento.table';

export class MantenimientoDetalladoTallerDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ nullable: true })
  codigoOrden: string | null;

  @ApiProperty()
  tipo: string;

  @ApiProperty()
  estado: string;

  @ApiProperty()
  descripcion: string;

  @ApiProperty()
  kilometraje: number;

  @ApiProperty({ nullable: true })
  kilometrajeProximoMantenimiento: number | null;

  @ApiProperty()
  costoTotal: string;

  @ApiProperty({ enum: mantenimientosMoneda.enumValues, example: 'PEN' })
  moneda: MantenimientoMoneda;

  @ApiProperty()
  fechaIngreso: Date;

  @ApiProperty({ nullable: true })
  fechaSalida: Date | null;

  @ApiProperty({ nullable: true })
  vehiculoPlaca: string | null;

  @ApiProperty({ nullable: true })
  vehiculoMarca: string | null;

  @ApiProperty({ nullable: true })
  vehiculoModelo: string | null;

  @ApiProperty({ nullable: true })
  tallerNombre: string | null;

  @ApiProperty({ nullable: true })
  tallerTipo: string | null;

  @ApiProperty({ nullable: true })
  tallerSucursal: string | null;

  @ApiProperty({ nullable: true })
  numeroFacturaCertificado: string | null;

  @ApiProperty()
  intervencion: string;

  @ApiProperty({ nullable: true })
  observaciones: string | null;

  @ApiProperty({ nullable: true })
  vehiculoAnio: number | null;

  @ApiProperty({ nullable: true })
  vehiculoTipo: string | null;

  @ApiProperty({ nullable: true })
  vehiculoEstado: string | null;
}

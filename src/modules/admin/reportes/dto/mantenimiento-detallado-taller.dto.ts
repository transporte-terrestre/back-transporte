import { ApiProperty } from "@nestjs/swagger";

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

  @ApiProperty()
  costoTotal: string;

  @ApiProperty()
  fechaIngreso: Date;

  @ApiProperty({ nullable: true })
  fechaSalida: Date | null;

  @ApiProperty()
  vehiculoPlaca: string;

  @ApiProperty()
  vehiculoMarca: string;

  @ApiProperty()
  vehiculoModelo: string;
}

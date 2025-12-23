import { ApiProperty } from "@nestjs/swagger";

export class MantenimientoDetalladoVehiculoDto {
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
  tallerNombre: string;

  @ApiProperty()
  tallerTipo: string;
}

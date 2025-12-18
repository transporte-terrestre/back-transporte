import { ApiProperty } from "@nestjs/swagger";

export class ViajeDetalladoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  tipoRuta: string;

  @ApiProperty({ nullable: true })
  rutaOcasional: string | null;

  @ApiProperty({ nullable: true })
  rutaOrigen: string | null;

  @ApiProperty({ nullable: true })
  rutaDestino: string | null;

  @ApiProperty({ nullable: true })
  distancia: string | null;

  @ApiProperty()
  estado: string;

  @ApiProperty()
  modalidadServicio: string;

  @ApiProperty()
  fechaSalida: Date;

  @ApiProperty({ nullable: true })
  fechaLlegada: Date | null;
}
